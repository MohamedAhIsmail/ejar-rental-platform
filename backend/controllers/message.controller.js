import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';
import userModel from '../models/user.model.js';

export default class Message {
  static async createMessage(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user exists
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      const { chatId, content } = req.body;

      // * Check if the chatId exists
      if (!chatId) {
        return res.status(400).json({ message: 'chatId is required' });
      }

      const chat = await chatModel.findById(chatId);

      if (!chat) {
        return res.status(404).json({ message: 'chat does not exist' });
      }

      // * Check if the user is a member of the chat
      if (!chat.members.includes(userId)) {
        return res.status(403).json({ message: 'not a member of the chat' });
      }

      // * Check if the content is provided
      if (!content) {
        return res.status(400).json({ message: 'content is required' });
      }

      // * Create the message
      const message = new messageModel({
        chatId,
        senderId: userId,
        content,
      });
      await message.save();

      return res.status(200).json(message);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async getChatMessages(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user exists
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      const { chatId } = req.params;

      // * Check if the chatId exists
      if (!chatId) {
        return res.status(400).json({ message: 'chatId is required' });
      }

      const chat = await chatModel.findById(chatId);

      if (!chat) {
        return res.status(404).json({ message: 'chat does not exist' });
      }

      // * Check if the user is a member of the chat
      if (!chat.members.includes(userId)) {
        return res.status(403).json({ message: 'not a member of the chat' });
      }

      const messages = await messageModel.find({ chatId });

      if (!messages) {
        return res.status(404).json({ message: 'no messages found' });
      }
      return res.status(200).json(messages);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }
}
