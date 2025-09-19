import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "./AuthLayout";
import AnimatedInput from "./AnimatedInput";
import AnimatedButton from "./AnimatedButton";
import SocialLogin from "./SocialLogin";
import authService from "../../services/authService";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Add extra animation effect
    const timeout = setTimeout(() => {
      const formCard = document.querySelector(".form-card");
      if (formCard) formCard.classList.add("animate-pulse");

      setTimeout(() => {
        if (formCard) formCard.classList.remove("animate-pulse");
      }, 1500);
    }, 2000);

    // Add random burst effects
    const burstInterval = setInterval(() => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      const burst = document.createElement("div");
      burst.className = "absolute w-1 h-1 bg-white rounded-full z-20";
      burst.style.left = `${x}vw`;
      burst.style.top = `${y}vh`;
      burst.style.boxShadow = "0 0 20px 10px rgba(255, 255, 255, 0.8)";
      burst.style.animation = "sparkle 1.5s forwards";

      document.body.appendChild(burst);

      setTimeout(() => {
        document.body.removeChild(burst);
      }, 1500);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      clearInterval(burstInterval);
    };
  }, []);

  // Handle form input changes
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error for this field when typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  // Validate form input
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission with enhanced animation
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (validateForm()) {
        setLoading(true);

        // Add submission animation effect
        const formEl = e.target;
        formEl.classList.add("submitting");

        try {
          // Call our authentication service
          const result = await authService.login({
            email: formData.email,
            password: formData.password,
          });

          if (result.success) {
            toast.success("Login successful! Welcome back!");
            
            // Redirect to home page after successful login
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          } else {
            toast.error(result.error || "Login failed. Please try again.");
            setErrors({ general: result.error });
          }
        } catch (error) {
          toast.error("Network error. Please check your connection.");
          setErrors({ general: "Network error. Please try again." });
        } finally {
          setLoading(false);
          formEl.classList.remove("submitting");
        }
      }
    },
    [formData, validateForm]
  );

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -30 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.7, ease: [0.17, 0.67, 0.83, 0.67] },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.7, rotate: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: [0.43, 0.13, 0.23, 0.96],
        type: "spring",
        stiffness: 250,
      },
    },
  };

  return (
    <AuthLayout>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="sm:mx-auto sm:w-full sm:max-w-md z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Only show logo on mobile since we have it on the left panel for desktop */}
            <div className="md:hidden">
              <motion.div
                className="flex justify-center"
                variants={logoVariants}
              >
                <motion.div className="relative w-32 h-32 flex items-center justify-center mb-6 floating-logo">
                  <motion.img
                    src="/UptoSkills_logo.png"
                    alt="UpToSkills Logo"
                    className="w-24 h-24 object-contain relative z-10"
                  />
                </motion.div>
              </motion.div>
            </div>

            <motion.h2
              className="mt-2 text-center text-4xl font-extrabold text-gray-800"
              variants={itemVariants}
            >
              Welcome Back!
            </motion.h2>
            <motion.p
              className="mt-3 text-center text-lg text-gray-600 font-medium"
              variants={itemVariants}
            >
              Sign in to your account
            </motion.p>
            <motion.p
              className="mt-3 text-center text-sm text-gray-600"
              variants={itemVariants}
            >
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-orange-500 hover:text-teal-600 focus:outline-none transition-all duration-300"
              >
                Sign up
              </Link>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          {/* Card content */}
          <motion.div
            className="bg-white py-10 px-6 shadow-xl sm:rounded-xl sm:px-12 border border-gray-100 relative form-card"
            whileHover={{
              boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <motion.form
              className="space-y-6"
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.01 }}
            >
              {/* Email field */}
              <motion.div variants={itemVariants}>
                <AnimatedInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  label="Email address"
                  error={errors.email}
                  icon={
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0],
                        color: ["#6B7280", "#F97316", "#6B7280"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.5,
                      }}
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </motion.svg>
                  }
                />
              </motion.div>

              {/* Password field */}
              <motion.div variants={itemVariants}>
                <AnimatedInput
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  label="Password"
                  error={errors.password}
                  icon={
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0],
                        color: ["#6B7280", "#10B981", "#6B7280"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1,
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  }
                />
              </motion.div>

              {/* Remember me & Forgot password */}
              <motion.div
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-white text-orange-500 focus:ring-orange-500 border-orange-300 rounded transition-all duration-300"
                    aria-label="Remember me"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-orange-500 hover:text-teal-400 transition-all duration-300"
                    aria-label="Forgot your password"
                  >
                    Forgot password?
                  </a>
                </div>
              </motion.div>

              {/* Submit button */}
              <motion.div variants={itemVariants}>
                <AnimatedButton loading={loading} aria-label="Sign in">
                  Sign in
                </AnimatedButton>
              </motion.div>
            </motion.form>

            {/* Social login section */}
            <SocialLogin />
          </motion.div>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default SignIn;

// Main Login component for routing
const Login = () => {
  return <SignIn />;
};

export { Login };