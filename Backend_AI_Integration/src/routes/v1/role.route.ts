import express from 'express';
import * as Role_Controller from '@/controllers/role.controller';

const router = express.Router();

//api/v1/role/create
router.post('/create', Role_Controller.createRole)



export default router;