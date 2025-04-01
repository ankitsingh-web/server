import {Router} from 'express'
import { allPayment, buySubscription, cancelSubscription, getRazorpayApiKey, verifySubsciption } from '../controllers/payment.controller.js';
import { authorizedRoles, isLoggedIn } from '../middleware/auth.middleware.js';
const router=Router();
router.route('/razorpay-key')
.get(isLoggedIn,getRazorpayApiKey);

router.route('/subscribe')
.post(isLoggedIn,buySubscription)

router.route('/verify')
.post(isLoggedIn,verifySubsciption);

router.route('/unsubscribe')
.post(isLoggedIn,cancelSubscription);

router.route('/')
.get(
  isLoggedIn,
  authorizedRoles('ADMIN'),
  allPayment);

export default router;