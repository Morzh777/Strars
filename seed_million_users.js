import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

// Базовые данные для генерации
const names = [
  'Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артём', 'Илья', 'Кирилл', 'Михаил',
  'Анна', 'Мария', 'Елена', 'Ольга', 'Татьяна', 'Наталья', 'Ирина', 'Екатерина', 'Светлана', 'Юлия'
];

const surnames = [
  'Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов', 'Новиков', 'Фёдоров',
  'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семёнов', 'Егоров', 'Павлов', 'Козлов', 'Степанов', 'Николаев'
];

const companies = [
  'Яндекс', 'Сбер', 'Тинькофф', 'VK', 'Ozon', 'Wildberries', 'Авито', 'МТС', 'Мегафон', 'Ростелеком',
  'ПИК', 'Газпром', 'Роснефть', 'Лукойл', 'Магнит', 'X5 Group', 'Норникель', 'Severstal', 'NLMK', 'Evraz'
];

const positions = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist',
  'Product Manager', 'UX/UI Designer', 'QA Engineer', 'Team Lead', 'CTO', 'Архитектор', 'Аналитик',
  'Специалист', 'Инженер', 'Менеджер', 'Директор', 'Консультант', 'Эксперт', 'Руководитель', 'Координатор'
];

const technologies = [
  'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'Go', 'Rust', 'TypeScript', 'JavaScript',
  'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'Microservices', 'DevOps'
];

// Функция для генерации случайного элемента из массива
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Функция для генерации случайного числа в диапазоне
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Функция для генерации пользователя
const generateUser = (index) => {
  const name = randomChoice(names);
  const surname = randomChoice(surnames);
  const fullName = `${name} ${surname}`;
  const username = `${name.toLowerCase()}_${surname.toLowerCase()}_${index}`;
  const email = `${username}@example.com`;
  
  const company = randomChoice(companies);
  const position = randomChoice(positions);
  const tech1 = randomChoice(technologies);
  const tech2 = randomChoice(technologies);
  const tech3 = randomChoice(technologies);
  
  // Аватар от 1 до 10
  const avatarNumber = randomInt(1, 10);
  const avatar = `https://www.heroui.com/avatars/avatar-${avatarNumber}.png`;
  
  // Генерируем starsCount с нормальным распределением (больше людей со средними значениями)
  let starsCount;
  const rand = Math.random();
  if (rand < 0.1) {
    // 10% - топ игроки (4000-5000 звезд)
    starsCount = randomInt(4000, 5000);
  } else if (rand < 0.3) {
    // 20% - хорошие игроки (2500-3999 звезд)
    starsCount = randomInt(2500, 3999);
  } else if (rand < 0.7) {
    // 40% - средние игроки (1000-2499 звезд)
    starsCount = randomInt(1000, 2499);
  } else {
    // 30% - новички (0-999 звезд)
    starsCount = randomInt(0, 999);
  }
  
  const maxStars = 5000;
  const description = `${position} в ${company}. ${randomChoice([
    'Создаю крутые продукты!',
    'Люблю программировать!',
    'Решаю сложные задачи!',
    'Делаю мир лучше через код!',
    'Эксперт в своей области!',
    'Строю будущее технологий!'
  ])} 🚀`;
  
  const tags = `#${tech1} #${tech2} #${tech3} ⭐`;
  
  return {
    email,
    name: fullName,
    image: avatar,
    password: '$2a$10$defaulthashedpassword', // Заглушка для пароля
    description,
    tags,
    starsCount,
    maxStars,
    isActive: Math.random() > 0.05, // 95% активных пользователей
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Случайная дата за последний год
  };
};

// Основная функция добавления пользователей
async function seedMillionUsers() {
  console.log('🚀 Начинаем добавление 1,000,000 пользователей...\n');
  
  const BATCH_SIZE = 1000; // Добавляем по 1000 за раз
  const TOTAL_USERS = 1000000;
  const TOTAL_BATCHES = Math.ceil(TOTAL_USERS / BATCH_SIZE);
  
  let addedUsers = 0;
  const startTime = Date.now();
  
  try {
    for (let batch = 0; batch < TOTAL_BATCHES; batch++) {
      const batchStartTime = Date.now();
      
      // Генерируем пакет пользователей
      const users = [];
      const currentBatchSize = Math.min(BATCH_SIZE, TOTAL_USERS - addedUsers);
      
      for (let i = 0; i < currentBatchSize; i++) {
        users.push(generateUser(addedUsers + i + 1));
      }
      
      // Добавляем в БД
      await prisma.user.createMany({
        data: users,
        skipDuplicates: true,
      });
      
      addedUsers += currentBatchSize;
      const batchTime = Date.now() - batchStartTime;
      const avgTimePerUser = batchTime / currentBatchSize;
      const totalElapsed = (Date.now() - startTime) / 1000;
      const estimatedTotal = (totalElapsed / addedUsers) * TOTAL_USERS;
      const remaining = estimatedTotal - totalElapsed;
      
      // Прогресс
      const progress = ((addedUsers / TOTAL_USERS) * 100).toFixed(1);
      console.log(`📊 Batch ${batch + 1}/${TOTAL_BATCHES} завершен`);
      console.log(`   ✅ Добавлено: ${addedUsers.toLocaleString()} / ${TOTAL_USERS.toLocaleString()} (${progress}%)`);
      console.log(`   ⏱️  Время batch: ${batchTime}ms (${avgTimePerUser.toFixed(2)}ms/user)`);
      console.log(`   🕐 Осталось: ~${Math.round(remaining)}s`);
      console.log('');
      
      // Небольшая пауза чтобы не перегрузить БД
      if (batch % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`🎉 Успешно добавлено ${addedUsers.toLocaleString()} пользователей!`);
    console.log(`⏱️  Общее время: ${Math.round(totalTime)}s`);
    console.log(`📈 Скорость: ${Math.round(addedUsers / totalTime)} users/sec`);
    
    // Проверяем статистику
    console.log('\n📊 Статистика по starsCount:');
    const stats = await prisma.user.aggregate({
      _count: { id: true },
      _avg: { starsCount: true },
      _max: { starsCount: true },
      _min: { starsCount: true },
    });
    
    console.log(`   Всего пользователей: ${stats._count.id.toLocaleString()}`);
    console.log(`   Средние звезды: ${Math.round(stats._avg.starsCount)}`);
    console.log(`   Максимум звезд: ${stats._max.starsCount}`);
    console.log(`   Минимум звезд: ${stats._min.starsCount}`);
    
  } catch (error) {
    console.error('❌ Ошибка при добавлении пользователей:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
console.log('🎯 Скрипт добавления миллиона пользователей');
console.log('📝 Используем аватары: https://www.heroui.com/avatars/avatar-1.png до avatar-10.png');
console.log('⚡ Используем индексы для максимальной производительности\n');

seedMillionUsers().catch(console.error);
