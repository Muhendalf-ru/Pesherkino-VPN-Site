import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IServer, CreateServerRequest, UpdateServerRequest } from '../../types/ServerTypes';

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateServerRequest | UpdateServerRequest) => void;
  server?: IServer | null;
  loading?: boolean;
}

export default function ServerModal({
  isOpen,
  onClose,
  onSubmit,
  server,
  loading = false,
}: ServerModalProps) {
  const [formData, setFormData] = useState<CreateServerRequest>({
    label: '',
    url: '',
    username: '',
    password: '',
    isActive: true,
  });

  const isEditing = !!server;

  useEffect(() => {
    if (server) {
      setFormData({
        label: server.label,
        url: server.url,
        username: server.username,
        password: server.password,
        isActive: server.isActive,
      });
    } else {
      setFormData({
        label: '',
        url: '',
        username: '',
        password: '',
        isActive: true,
      });
    }
  }, [server]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}>
          <motion.div
            className="modal-content admin-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Редактировать сервер' : 'Добавить сервер'}</h2>
              <button className="modal-close" onClick={onClose}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="server-form">
              <div className="form-group">
                <label htmlFor="label">Название сервера *</label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  required
                  placeholder="Например: Frankfurt, Stockholm, NL"
                />
              </div>

              <div className="form-group">
                <label htmlFor="url">URL для логина *</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  required
                  placeholder="https://example.com/login"
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Имя пользователя *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Введите имя пользователя"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Пароль *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Введите пароль"
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Активен
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                  disabled={loading}>
                  Отмена
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Сохранение...' : isEditing ? 'Обновить' : 'Добавить'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
