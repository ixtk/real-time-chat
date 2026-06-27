export function getChats(_req, res) {
  res.json({
    message: 'Chats endpoint is ready. Frontend currently uses mock data.',
    chats: [],
  })
}
