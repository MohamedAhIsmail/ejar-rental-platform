import processModel from '../models/process.model.js';
import productModel from '../models/Product.model.js';
import userModel from '../models/user.model.js';

export default class Process {
  static async createProcess(req, res) {
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

      // * Check if the product exists
      const { productId } = req.params;
      const product = await productModel.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'product does not exist' });
      }

      // * Check if the user is the owner of the product
      if (userId === product.renterId.toString()) {
        return res.status(403).json({ message: 'you are the owner' });
      }

      // * Check if the user already has a process for this product
      const existingProcess = await processModel.findOne({
        productId,
        renterId: userId,
      });
      if (existingProcess) {
        return res.status(400).json({
          message: 'you already have a process for this product',
        });
      }

      // * Get the values from the body
      const { startDate, endDate, price } = req.body;

      const newProcess = new processModel({
        productId,
        renterId: userId,
        startDate,
        endDate,
        price,
      });
      const process = await newProcess.save();
      return res.status(201).json(process);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async getAllProcesses(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user sending the request exists
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      // * Check if the user is an admin
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'unauthorized user' });
      }

      const processes = await processModel
        .find()
        .populate('productId', '_id name images')
        .populate('renterId', '_id userName');

      return res.status(200).json(processes);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async getUserProcesses(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user sending the request exists
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      // * Check if the user is an admin or the same user
      if (userRole !== 'admin' && user._id.toString() !== userId) {
        return res.status(403).json({ message: 'unauthorized user' });
      }

      const products = await productModel.find({ renterId: userId });
      if (products.length <= 0) {
        return res.status(404).json({ message: 'no products were found' });
      }

      const processes = await processModel
        .find({
          productId: { $in: products.map((product) => product._id) },
          status: 'pending',
        })
        .populate('productId', '_id name images')
        .populate('renterId', '_id userName');

      return res.status(200).json(processes);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }
  static async getFinishedProcesses(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user sending the request exists
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      // * Check if the user is an admin or the same user
      if (userRole !== 'admin' && user._id.toString() !== userId) {
        return res.status(403).json({ message: 'unauthorized user' });
      }

      const processes = await processModel
        .find({
          renterId: userId,
          status: 'finished',
        })
        .populate('productId', '_id name images')
        .populate('renterId', '_id userName');

      return res.status(200).json(processes);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async getProcess(req, res) {
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

      // * Check if the process exists
      const { id: processId } = req.params;
      const process = await processModel
        .findById(processId)
        .populate('productId', '_id name images')
        .populate('renterId', '_id userName');
      if (!process) {
        return res.status(404).json({ message: 'process does not exist' });
      }

      // * Check if the user is an admin or the renter
      if (userRole !== 'admin' && userId !== process.renterId.toString()) {
        return res.status(403).json({ message: 'unauthorized user' });
      }

      return res.status(200).json(process);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  // ? Get all process by a user

  // ? Extent the duration

  static async updateStatus(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user sending the request exists
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      // * Check if the process exists
      const { id: processId } = req.params;
      const process = await processModel.findById(processId);
      if (!process) {
        return res.status(404).json({ message: 'process does not exist' });
      }

      // * Get the associated product
      const product = await productModel.findById(process.productId);
      if (!product) {
        return res.status(404).json({ message: 'product does not exist' });
      }

      // * Check if the user is an admin or the owner of the product
      if (userRole !== 'admin' && product.renterId.toString() !== userId) {
        console.log(product.renterId._id.toString(), userId, 'line 5');
        return res.status(403).json({ message: 'unauthorized user' });
      }

      const { status, startDate, endDate, price } = req.body;
      const updateFields = {};

      // * Handle status update if provided
      if (status) {
        // * Check if the status is valid
        const validStatuses = [
          'pending',
          'canceled',
          'in progress',
          'finished',
        ];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({
            message:
              'status must be pending, canceled, in progress or finished',
          });
        }
        updateFields.status = status;
      }

      // * Handle startDate update if provided
      if (startDate) {
        updateFields.startDate = new Date(startDate);
      }

      // * Handle endDate update if provided
      if (endDate) {
        updateFields.endDate = new Date(endDate);
      }

      // * Handle price update if provided
      if (price) {
        updateFields.price = price;
      }

      // * Check if there are any fields to update
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({
          message:
            'At least one field (status, startDate, endDate, or price) is required for update',
        });
      }

      // * Update the process
      const updatedProcess = await processModel.findByIdAndUpdate(
        processId,
        updateFields,
        { new: true }
      );

      return res.status(200).json(updatedProcess);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async deleteProcess(req, res) {
    try {
      // * Check if request is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'no token provided' });
      }

      const { id: userId, role: userRole } = req.user;

      // * Check if the user sending the request exists
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      // * Check if the user is an admin
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'unauthorized user' });
      }

      // * Check if the process exists
      const { id: processId } = req.params;
      const process = await processModel.findById(processId);
      if (!process) {
        return res.status(404).json({ message: 'process does not exist' });
      }

      // * Check if the duration is still valid
      if (process.endDate < new Date()) {
        return res.status(403).json({ message: 'process is in progress' });
      }

      // * Delete the process
      await process.deleteOne();
      await productModel.findByIdAndUpdate(process.productId, {
        status: 'available',
      });

      return res.status(200).json({ message: 'process deleted successfully' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async getInProgressProcessesByProduct(req, res) {
    const { id } = req.params;

    try {
      const processes = await processModel.find({
        productId: id,
        status: 'in progress',
      });

      res.status(200).json({
        status: 'success',
        data: processes,
      });
    } catch (error) {
      console.error('Error fetching processes:', error.message);
      res.status(500).json({
        status: 'error',
        message: 'Server Error',
      });
    }
  }
}
