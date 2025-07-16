import { Router } from 'express';
import Process from '../controllers/process.controller.js';
import processJoiSchema from '../config/process.schema.js';
import { validation } from '../middleware/joi.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireVerification } from '../middleware/verification.middleware.js';

const processRouter = Router();

processRouter.post(
  '/:productId',
  validation(processJoiSchema),
  authMiddleware,
  requireVerification,
  Process.createProcess
);
processRouter.get('/', authMiddleware, Process.getAllProcesses);

processRouter.get('/user', authMiddleware, Process.getUserProcesses);
processRouter.get('/finished', authMiddleware, Process.getFinishedProcesses);
processRouter.get('/:id', authMiddleware, Process.getProcess);
processRouter.get('/getprod/:id', Process.getInProgressProcessesByProduct);

processRouter.put('/:id', authMiddleware, Process.updateStatus);
processRouter.delete('/:id', authMiddleware, Process.deleteProcess);

export default processRouter;
