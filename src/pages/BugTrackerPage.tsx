import { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import '../styles/bug-tracker.css';
import { v4 as uuidv4 } from 'uuid';
import {
  FaRegImage,
  FaTimes,
  FaUserAstronaut,
  FaCalendarAlt,
  FaDesktop,
  FaRocket,
  FaSignOutAlt,
  FaHome,
} from 'react-icons/fa';
import ThemeSwitcher from '../components/ui/ThemeSwitcher';
import { useAppSelector } from '../hooks/reduxHooks';
import { Link } from 'react-router-dom';

interface Bug {
  id: number;
  title: string;
  description: string;
  created_at: string;
  user_email: string;
  fixed: boolean;
  device?: string;
  client?: string;
  images?: string[];
}

// Функция для маскировки email
function maskEmail(email: string) {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  if (user.length <= 4) {
    return (
      <span>
        <span style={{ fontWeight: 600 }}>{user[0]}</span>
        <span style={{ color: '#b0b8d0' }}>•••</span>
        <span style={{ fontWeight: 600 }}>{user[user.length - 1]}</span>@{domain}
      </span>
    );
  }
  return (
    <span>
      <span style={{ fontWeight: 600 }}>{user.slice(0, 2)}</span>
      <span style={{ color: '#b0b8d0' }}>•••</span>
      <span style={{ fontWeight: 600 }}>{user.slice(-2)}</span>@{domain}
    </span>
  );
}

function BugTrackerPage() {
  const [user, setUser] = useState<User | null>(null);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [device, setDevice] = useState('');
  const [client, setClient] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'fixed' | 'notfixed'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const theme = useAppSelector((state) => state.theme.value);

  // Получаем пользователя
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Получаем баги
  const fetchBugs = async () => {
    const { data, error } = await supabase
      .from('bugs')
      .select('*')
      .order('created_at', { ascending: sortOrder === 'asc' });
    if (!error && data) setBugs(data as Bug[]);
  };
  useEffect(() => {
    fetchBugs();
    // eslint-disable-next-line
  }, [sortOrder]);

  // Загрузка изображений в Supabase Storage
  const uploadImages = async (files: File[], userId: string) => {
    const urls: string[] = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${uuidv4()}.${ext}`;
      const { error } = await supabase.storage.from('bug-images').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) {
        console.error('Ошибка загрузки файла:', error.message, error);
      } else {
        const { data } = supabase.storage.from('bug-images').getPublicUrl(fileName);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  };

  // Добавление бага
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!title.trim() || !description.trim() || !device || !client) {
      setError('Заполните все поля!');
      setLoading(false);
      return;
    }
    let imageUrls: string[] = [];
    if (images.length > 0 && user) {
      imageUrls = await uploadImages(images, user.id);
    }
    const bugData = {
      title,
      description,
      user_id: user!.id,
      user_email: user!.email!,
      device,
      client,
    } as Record<string, unknown>;
    if (imageUrls.length > 0) {
      bugData.images = imageUrls;
    }
    const { error } = await supabase.from('bugs').insert([bugData]);
    if (error) {
      setError('Ошибка при добавлении бага: ' + error.message);
      console.error(error);
    } else {
      setSuccess('Баг успешно добавлен!');
      setTitle('');
      setDescription('');
      setDevice('');
      setClient('');
      setImages([]);
      fetchBugs();
    }
    setLoading(false);
  };

  // Пометить баг как исправленный
  const handleToggleFixed = async (bug: Bug) => {
    setError(null);
    setSuccess(null);
    const { error } = await supabase.from('bugs').update({ fixed: !bug.fixed }).eq('id', bug.id);
    if (error) {
      setError('Ошибка при обновлении бага. Нет прав или проблема с Supabase.');
    } else {
      setSuccess('Статус бага обновлён!');
      fetchBugs();
    }
  };

  // Удалить баг (только для pesherkino@gmail.com)
  const handleDelete = async (bug: Bug) => {
    setError(null);
    setSuccess(null);
    if (!user || user.email !== 'pesherkino@gmail.com') {
      setError('Удаление доступно только владельцу.');
      return;
    }
    const { error } = await supabase.from('bugs').delete().eq('id', bug.id);
    if (error) {
      setError('Ошибка при удалении бага. Нет прав или проблема с Supabase.');
    } else {
      setSuccess('Баг удалён!');
      fetchBugs();
    }
  };

  // Фильтрация багов
  const filteredBugs = bugs.filter((bug) => {
    if (filterStatus === 'fixed') return bug.fixed;
    if (filterStatus === 'notfixed') return !bug.fixed;
    return true;
  });

  // Применяем тему к body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="bug-tracker-container">
      {/* Lightbox для просмотра изображения */}
      {lightboxImg && (
        <div className="bug-lightbox" onClick={() => setLightboxImg(null)}>
          <div className="bug-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImg} alt="bug-img-full" />
            <button
              className="bug-lightbox-close"
              onClick={() => setLightboxImg(null)}
              title="Закрыть предпросмотр">
              <FaTimes />
            </button>
          </div>
        </div>
      )}
      <motion.div
        className="bug-tracker-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}>
        <div className="bug-header-flex">
          <h1
            className="bug-tracker-title"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              justifyContent: 'center',
              margin: '0 auto',
            }}>
            🪐 Pesherkino Bug Tracker
            <ThemeSwitcher />
          </h1>
        </div>
        <p className="bug-tracker-subtitle">
          Оставьте информацию о найденных багах — поможем сделать сервис лучше!
        </p>
      </motion.div>

      <div className="bug-tracker-form-block">
        {!user ? (
          <>
            <div
              style={{
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '1.35rem',
                letterSpacing: 0.5,
                marginBottom: 8,
                color: 'var(--auth-title-color, #a78bfa)',
              }}>
              Авторизация
            </div>
            <div
              style={{
                textAlign: 'center',
                color: '#b0b8d0',
                fontSize: '1.01rem',
                marginBottom: 18,
              }}>
              Для написания баг трекеров
            </div>
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                className: 'bug-auth-ui',
                variables: {
                  default: {
                    colors: {
                      brand: '#a78bfa',
                      brandAccent: '#fbc2eb',
                      inputBorder: '#a78bfa',
                      inputLabelText: '#fbc2eb',
                      inputText: '#fff',
                      inputBackground: 'rgba(24,28,42,0.85)',
                      inputPlaceholder: '#b0b8d0',
                      messageText: '#fbc2eb',
                      messageBackground: 'rgba(30,41,59,0.7)',
                      anchorTextColor: '#a78bfa',
                      brandButtonText: '#232946',
                    },
                    fonts: {
                      bodyFontFamily: 'inherit',
                      buttonFontFamily: 'inherit',
                      inputFontFamily: 'inherit',
                    },
                    radii: {
                      borderRadiusButton: '10px',
                      inputBorderRadius: '10px',
                    },
                  },
                },
              }}
              redirectTo={window.location.origin + '/bug-tracker'}
              providers={['google']}
              theme="dark"
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Почта',
                    password_label: 'Пароль',
                    button_label: 'Войти',
                    link_text: 'Войти',
                  },
                  sign_up: {
                    email_label: 'Email',
                    password_label: 'Пароль',
                    button_label: 'Зарегистрироваться',
                    link_text: 'Регистрация',
                  },
                  forgotten_password: {
                    link_text: 'Забыли пароль?',
                    email_label: 'Почта',
                    button_label: 'Восстановить',
                    confirmation_text: 'Проверьте почту для восстановления пароля.',
                  },
                },
              }}
            />
          </>
        ) : (
          <form className="bug-form" onSubmit={handleSubmit}>
            <div className="bug-form-label">Добавить баг</div>
            {/* Кастомная drag&drop зона */}
            <div
              className={`bug-upload-zone${dragActive ? ' active' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActive(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files) {
                  setImages(Array.from(e.dataTransfer.files).slice(0, 3));
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Загрузить скриншоты">
              <FaRegImage size={32} color="#a78bfa" />
              <div>Перетащите или выберите скриншоты (до 3)</div>
              <input
                type="file"
                ref={fileInputRef}
                className="bug-upload-input"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                placeholder="Выберите скриншоты"
                onChange={(e) => {
                  if (e.target.files) {
                    setImages(Array.from(e.target.files).slice(0, 3));
                  }
                }}
              />
            </div>
            {/* Превью выбранных изображений */}
            {images.length > 0 && (
              <div className="bug-upload-preview-list">
                {images.map((img, idx) => (
                  <div className="bug-upload-preview" key={idx}>
                    <img src={URL.createObjectURL(img)} alt="preview" />
                    <button
                      type="button"
                      className="bug-upload-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImages(images.filter((_, i) => i !== idx));
                      }}
                      title="Удалить изображение">
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label style={{ fontWeight: 600, marginBottom: 2 }}>
              Заголовок бага
              <span className="bug-form-label-required">*</span>
            </label>
            <input
              type="text"
              className="bug-form-input"
              placeholder="Заголовок бага"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            <label style={{ fontWeight: 600, marginBottom: 2 }}>
              Описание бага
              <span className="bug-form-label-required">*</span>
            </label>
            <textarea
              className="bug-form-textarea"
              placeholder="Описание бага"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              required
            />
            <label style={{ fontWeight: 600, marginBottom: 2 }}>
              Устройство
              <span className="bug-form-label-required">*</span>
            </label>
            <select
              className="bug-form-input"
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              required
              title="Устройство"
              aria-label="Устройство">
              <option value="">Устройство</option>
              <option value="Windows">Windows</option>
              <option value="Mac">Mac</option>
              <option value="Linux">Linux</option>
              <option value="Android">Android</option>
              <option value="iOS">iOS</option>
              <option value="Другое">Другое</option>
            </select>
            <label style={{ fontWeight: 600, marginBottom: 2 }}>
              Клиент
              <span className="bug-form-label-required">*</span>
            </label>
            <select
              className="bug-form-input"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              required
              title="Клиент"
              aria-label="Клиент">
              <option value="">Клиент</option>
              <option value="Nekoray">Nekoray</option>
              <option value="Streisand">Streisand</option>
              <option value="Hiddify">Hiddify</option>
              <option value="Pesherkino VPN">Pesherkino VPN</option>
              <option value="Pesherkino VPN Браузер">Pesherkino VPN Браузер</option>
              <option value="Другое">Другое</option>
            </select>
            {error && <div className="bug-form-error">{error}</div>}
            {success && <div className="bug-form-success">{success}</div>}
            <button type="submit" className="bug-form-submit" disabled={loading}>
              {loading ? 'Отправка...' : 'Оставить баг'}
            </button>
            <Link to="/" className="bug-home-btn">
              <FaHome style={{ fontSize: 18 }} /> На главную
            </Link>
            <button
              type="button"
              className="bug-form-logout bug-logout-btn"
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                margin: '0 auto',
              }}>
              <FaSignOutAlt style={{ fontSize: 18 }} /> Выйти из аккаунта
            </button>
          </form>
        )}
      </div>

      {/* Фильтры багов */}
      <div
        style={{
          maxWidth: 600,
          margin: '0 auto 18px auto',
          display: 'flex',
          gap: 16,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <div style={{ color: '#b0b8d0', fontSize: '0.97rem', marginBottom: 2 }}>
            <b>Фильтры:</b> используйте для поиска нужных багов
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <select
                className="bug-form-input"
                style={{ minWidth: 120 }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'fixed' | 'notfixed')}
                title="Фильтр по статусу"
                aria-label="Фильтр по статусу">
                <option value="all">Все</option>
                <option value="notfixed">Не исправленные</option>
                <option value="fixed">Исправленные</option>
              </select>
              <span className="bug-filter-description">
                <span>Все</span> — показать все баги
                <br />
                <span>Не исправленные</span> — только открытые
                <br />
                <span>Исправленные</span> — только решённые
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <select
                className="bug-form-input"
                style={{ minWidth: 120 }}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                title="Сортировка по дате"
                aria-label="Сортировка по дате">
                <option value="desc">Сначала новые</option>
                <option value="asc">Сначала старые</option>
              </select>
              <span className="bug-filter-description">
                <span>Сначала новые</span> — последние сверху
                <br />
                <span>Сначала старые</span> — сначала ранние баги
              </span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="bug-list-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}>
        <h2 className="bug-list-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          🐞 Список багов
          <span
            style={{
              background: 'linear-gradient(90deg,#a78bfa,#fbc2eb)',
              color: '#232946',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '2px 12px',
              marginLeft: 8,
            }}>
            {' '}
            {filteredBugs.length}{' '}
          </span>
        </h2>
        <div style={{ color: '#b0b8d0', fontSize: '0.98rem', marginBottom: 14 }}>
          Здесь отображаются все найденные и отправленные пользователями баги. Вы можете отметить
          баг как исправленный или просмотреть детали.
        </div>
        {filteredBugs.length === 0 ? (
          <div className="bug-list-empty">Багов пока нет — будьте первым!</div>
        ) : (
          <ul className="bug-list">
            {filteredBugs.map((bug) => (
              <motion.li
                key={bug.id}
                className={`bug-list-item${bug.fixed ? ' bug-fixed' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.03, boxShadow: '0 0 32px #a78bfa88' }}>
                <div className="bug-item-title">
                  {bug.fixed ? <span className="bug-fixed-label">✔ Исправлено</span> : null}
                  {bug.title}
                </div>
                <div
                  className="bug-item-desc"
                  style={bug.fixed ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>
                  {bug.description}
                </div>
                {/* Просмотр изображений */}
                {bug.images && bug.images.length > 0 && (
                  <div className="bug-images-list">
                    {bug.images.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="bug-img"
                        className="bug-image-thumb"
                        onClick={() => setLightboxImg(url)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                )}
                {/* Футер карточки: метаданные и действия */}
                <div className="bug-card-footer">
                  <div className="bug-item-meta-row">
                    <span className="bug-meta-block">
                      <FaCalendarAlt /> {new Date(bug.created_at).toLocaleString()}
                    </span>
                    <span className="bug-meta-block">
                      <FaUserAstronaut /> {maskEmail(bug.user_email)}
                    </span>
                    {bug.device && (
                      <span className="bug-meta-block">
                        <FaDesktop /> {bug.device}
                      </span>
                    )}
                    {bug.client && (
                      <span className="bug-meta-block">
                        <FaRocket /> {bug.client}
                      </span>
                    )}
                  </div>
                  {user && (
                    <div className="bug-item-actions">
                      <button
                        className={`bug-fixed-toggle${bug.fixed ? ' active' : ''}`}
                        type="button"
                        onClick={() => handleToggleFixed(bug)}
                        title={bug.fixed ? 'Сделать неактуальным' : 'Пометить как исправлено'}>
                        {bug.fixed ? <FaTimes /> : <FaRocket />}{' '}
                        {bug.fixed ? 'Неактуально' : 'Исправлено'}
                      </button>
                      {user.email === 'pesherkino@gmail.com' && (
                        <button
                          className="bug-delete-btn"
                          type="button"
                          onClick={() => handleDelete(bug)}
                          title="Удалить баг">
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}

export default BugTrackerPage;
