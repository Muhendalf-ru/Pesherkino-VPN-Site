export interface Achievement {
  year: number;
  title: string;
  description: string;
  metrics?: Array<{
    value: string;
    label: string;
  }>;
  icon?: string;
  isMilestone?: boolean;
}

export const achievementsData: Achievement[] = [
  {
    year: 2024,
    title: 'Первые шаги в мире VPN',
    description: 'Запуск локального VPN сервера с целью изучения технологий и создания безопасного соединения для личного использования',
    metrics: [
      { value: '1', label: 'Сервер' },
      { value: '4', label: 'Пользователя' }
    ],
    icon: '/planet.svg',
    isMilestone: true
  },
  {
    year: 2024,
    title: 'Расширение для "своих"',
    description: 'Развитие проекта до уровня локального VPN для друзей и близких. Первые реальные пользователи оценили качество сервиса',
    metrics: [
      { value: '2', label: 'Сервера' },
      { value: '40+', label: 'Пользователей' }
    ],
    icon: '/world.svg'
  },
  {
    year: 2025,
    title: 'Создание Telegram Бота',
    description: 'Старт разработки собственного Telegram бота для управления VPN сервисом. Теперь у нас есть удобный способ взаимодействия с пользователями',
    metrics: [
      { value: '1', label: 'Бот' },
      { value: '50+', label: 'Пользователей' }
    ],
    icon: '/telegram.svg',
    isMilestone: true
  },
  {
    year: 2025,
    title: 'Desktop приложение',
    description: 'Активная разработка собственного десктопного приложения для Windows. Расширение функциональности и улучшение пользовательского опыта',
    metrics: [
      { value: '70+', label: 'Пользователей' },
      { value: '4', label: 'Локации' }
    ],
    icon: '/mascot.png'
  },
  {
    year: 2025,
    title: 'Веб-сайт и расширение браузера',
    description: 'Создание собственного веб-сайта и разработка расширения для браузера. Полный цикл продуктов для максимального удобства пользователей',
    metrics: [
      { value: '80+', label: 'Пользователей' },
      { value: '4', label: 'Локации' },
      { value: '1', label: 'Сайт' }
    ],
    icon: '/world.svg',
    isMilestone: true
  }
]; 