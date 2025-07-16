

 //  Only verified users can do etc..
export const requireVerification = (req, res, next) => {
    if (!req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your account is not verified by admin.",
      });
    }
    next(); //Continue only if verified
  };
  