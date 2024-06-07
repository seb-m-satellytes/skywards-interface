const apiRoutes = {
  base: import.meta.env.VITE_SERVER_ROUTE || 'http://localhost:8000',
  todos: '/todos',
  items: '/items',
  settlements: '/settlements',
  characters: '/characters',
  gameSession: '/game_sessions',
  activities: '/activities',
  buildings: '/buildings',
  blueprints: '/blueprints',
}

export { apiRoutes }
