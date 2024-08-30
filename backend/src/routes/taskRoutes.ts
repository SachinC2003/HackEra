import { Request, Response } from 'express';
import { taskModel, taskValidation } from '../models/taskModel';
import { authenticatejwt } from './middlewares/authMiddleware';
import { userModel } from '../models/userModel';
const router= require ('express').Router();

router.post('/tasks', authenticatejwt, async (req: Request, res: Response) => {
    try {
        req.body.userid = req.headers.id;
        const { error } = taskValidation(req.body);
        if (error) return res.status(400).send({ success: false, message: error.details[0].message });

        const { checklist, boardId, ...rest } = req.body;
        if (!checklist || checklist.length === 0) {
            return res.status(400).send({ success: false, message: 'Checklist must have at least one element' });
        }

        const newTask = new taskModel({ ...rest, checklist, boardId });
        await newTask.save();
        return res.status(201).send({ success: true, data: newTask });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});

router.get('/:taskId', async (req: Request, res: Response) => {
    try {
      const taskId = req.params.taskId;
  
      
      const task = await taskModel.findById(taskId)
  
      if (!task) {
        return res.status(404).send({ success: false, message: 'Task not found' });
      }
  
      return res.status(200).send({ success: true, data: task });

    } catch (error) {
      console.error('Error fetching task:', error);
      return res.status(500).send({ success: false, message: 'Internal server error', error });
    }
});

router.put('/:taskId', authenticatejwt, async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;
        const updateFields = req.body;
        const userId = req.headers.id;

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        const task = await taskModel.findById(taskId);

        if (!task) {
            return res.status(404).send({ success: false, message: "Task not found" });
        }
        if(task.userid.toString() !== userId && updateFields.assignedTo && updateFields.assignedTo !== task.assignedTo){
            return res.status(403).send({ success: false, message: "You are not authorized to change this field" });
        }
        if (task.userid.toString() !== userId && task.assignedTo !== user.email) {
            return res.status(403).send({ success: false, message: "You are not authorized to edit this task" });
        }

        const updatedTask = await taskModel.findByIdAndUpdate(taskId, updateFields, { new: true });

        if (!updatedTask) {
            return res.status(404).send({ success: false, message: "Task not found" });
        }

        return res.status(200).send({ success: true, data: updatedTask });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Internal server error", error });
    }
});


router.delete('/:taskId', authenticatejwt, async (req: Request, res: Response) => {
  try {
      const { taskId } = req.params;
      const userId = req.headers.id;

      const user = await userModel.findById(userId);
      
      if (!user) {
          return res.status(404).send({ success: false, message: 'User not found' });
      }
      
      const task = await taskModel.findById(taskId);

      if (!task) {
          return res.status(404).send({ success: false, message: "Task not found" });
      }

      // Check if the user ID matches the task's user ID
      if (task.userid.toString() !== userId && task.assignedTo.toString() !== user.email) {
          return res.status(403).send({ success: false, message: "You are not authorized to delete this task" });
      }

      // Delete the task
      const deletedTask = await taskModel.findByIdAndDelete(taskId);

      return res.status(200).send({ success: true, message: "Task deleted successfully" });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ success: false, message: "Internal server error", error });
  }
});



export {router};