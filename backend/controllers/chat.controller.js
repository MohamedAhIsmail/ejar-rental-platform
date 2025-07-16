import chatModel from '../models/chat.model.js';
import userModel from '../models/user.model.js';

export default class Chat {
  static async createChat(req, res) {
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

      // * Check if the receiverId exists
      const { receiverId } = req.body;

      if (!receiverId) {
        return res.status(400).json({ message: 'receiverId is required' });
      }

      const receiver = await userModel.findById(receiverId);

      if (!receiver) {
        return res.status(404).json({ message: 'receiver does not exist' });
      }

      // * Check if trying to create chat with self
      if (receiverId === userId.toString()) {
        return res
          .status(400)
          .json({ message: 'cannot create chat with yourself' });
      }

      // * Check if chat already exists
      let chat = await chatModel.findOne({
        members: { $all: [userId, receiverId] },
      });

      if (!chat) {
        chat = new chatModel({
          members: [userId, receiverId],
        });
        await chat.save();
      }

      res.status(200).json(chat);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async getChatById(req, res) {
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

      // add the userpicture
      const chat = await chatModel
        .findById(chatId)
        .populate('members', '_id userName profilePicture');

      // * Check if there is any chats
      if (!chat) {
        return res.status(404).json({ message: 'no chats were found' });
      }

      // * Check if the user is a member of the chat
      if (
        !chat.members.some(
          (member) => member._id.toString() === userId.toString()
        )
      ) {
        return res.status(403).json({ message: 'not authorized' });
      }

      return res.status(200).json(chat);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async getUserChats(req, res) {
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

      // add the userpicture
      const chats = await chatModel
        .find({ members: { $in: [userId] } })
        .populate('members', '_id userName profilePicture');

      // * Check if there is any chats
      if (chats.length <= 0) {
        return res.status(404).json({ message: 'no chats were found' });
      }

      return res.status(200).json(chats);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }
}
