# TODO: Secure Confidential Pages

- [x] Add resetFlowStep state to App.tsx
- [ ] Update handleForgetPassword to set resetFlowStep to 'otp-sent'
- [ ] Update handleVerifyOTP to set resetFlowStep to 'otp-verified'
- [ ] Update handleResetPassword to reset resetFlowStep to 'none'
- [ ] Modify /verify-otp route to check resetFlowStep === 'otp-sent'
- [ ] Modify /reset-password route to check resetFlowStep === 'otp-verified'
