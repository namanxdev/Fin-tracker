import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { User, Lock, Bell, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';

// Define validation schemas
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address")
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

function Settings() {
  const { user, updateProfile, changePassword, verifyPassword } = useAuthStore();
  const isDark = useThemeStore(state => state.isDark);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Password verification states
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });
  
  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.setValue('name', user.name || '');
      profileForm.setValue('email', user.email || '');
    }
  }, [user, profileForm]);
  
  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const handleProfileSubmit = async (data) => {
    try {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success('Profile updated successfully');
        // Reset form to initial state but keep the newly saved values
        profileForm.reset({
          name: data.name,
          email: data.email
        });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  // Verify the current password before allowing change
  const handleVerifyPassword = async () => {
    const currentPassword = passwordForm.getValues('currentPassword');
    
    if (!currentPassword) {
      passwordForm.setError('currentPassword', {
        type: 'manual',
        message: 'Please enter your current password',
      });
      return;
    }
    
    try {
      setIsVerifyingPassword(true);
      const result = await verifyPassword(currentPassword);
      
      if (result.success) {
        setPasswordVerified(true);
        toast.success('Password verified successfully');
        // Focus on the new password field for better UX
        setTimeout(() => {
          const newPasswordInput = document.querySelector('input[name="newPassword"]');
          if (newPasswordInput) newPasswordInput.focus();
        }, 100);
      } else {
        passwordForm.setError('currentPassword', {
          type: 'manual',
          message: 'Current password is incorrect',
        });
        setPasswordVerified(false);
      }
    } catch (error) {
      toast.error('Failed to verify password');
      setPasswordVerified(false);
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handlePasswordSubmit = async (data) => {
    // If password is not verified yet, verify first
    if (!passwordVerified) {
      await handleVerifyPassword();
      return;
    }
    
    try {
      const result = await changePassword(data.currentPassword, data.newPassword);
      if (result.success) {
        toast.success('Password updated successfully');
        // Complete form reset after password change
        passwordForm.reset({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordVerified(false); // Reset verification for next time
        // Reset password visibility states
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <button 
          className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} className="mr-2" />
          Profile
        </button>
        <button 
          className={`tab ${activeTab === 'security' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('security')}
        >
          <Lock size={18} className="mr-2" />
          Security
        </button>
        {/* <button 
          className={`tab ${activeTab === 'preferences' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('preferences')}
        >
          <Bell size={18} className="mr-2" />
          Preferences
        </button> */}
      </div>
      
      {/* Card for content */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Profile Tab - unchanged */}
          {activeTab === 'profile' && (
            /* Your existing profile form */
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                {/* ... existing profile fields ... */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full ${profileForm.formState.errors.name ? 'input-error' : ''}`}
                    {...profileForm.register('name')}
                  />
                  {profileForm.formState.errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">{profileForm.formState.errors.name.message}</span>
                    </label>
                  )}
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    disabled={true}
                    className={`input input-bordered w-full ${profileForm.formState.errors.email ? 'input-error' : ''}`}
                    {...profileForm.register('email')}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={profileForm.formState.isSubmitting || !profileForm.formState.isDirty}
                >
                  {profileForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}
          
          {/* Security Tab - with password verification */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                {/* Current Password with visibility toggle */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className={`input input-bordered w-full pr-10 ${passwordForm.formState.errors.currentPassword ? 'input-error' : ''}`}
                      {...passwordForm.register('currentPassword')}
                      disabled={passwordVerified}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.currentPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {passwordForm.formState.errors.currentPassword.message}
                      </span>
                    </label>
                  )}
                  
                  {/* Verification button */}
                  {!passwordVerified && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={handleVerifyPassword}
                        className="btn btn-sm btn-secondary"
                        disabled={isVerifyingPassword || !passwordForm.getValues('currentPassword')}
                      >
                        {isVerifyingPassword ? 
                          'Verifying...' : 
                          <div className="flex items-center">
                            <Shield size={16} className="mr-1" />
                            Verify Password
                          </div>
                        }
                      </button>
                    </div>
                  )}
                  
                  {/* Verification success message */}
                  {passwordVerified && (
                    <div className="mt-1 text-success flex items-center">
                      <Shield size={16} className="mr-1" />
                      Password verified successfully
                    </div>
                  )}
                </div>
                
                {/* Only show these fields after password is verified */}
                {passwordVerified && (
                  <>
                    {/* New Password with visibility toggle */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">New Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className={`input input-bordered w-full pr-10 ${passwordForm.formState.errors.newPassword ? 'input-error' : ''}`}
                          {...passwordForm.register('newPassword')}
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <label className="label">
                          <span className="label-text-alt text-error">{passwordForm.formState.errors.newPassword.message}</span>
                        </label>
                      )}
                    </div>
                    
                    {/* Confirm Password with visibility toggle */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Confirm New Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className={`input input-bordered w-full pr-10 ${passwordForm.formState.errors.confirmPassword ? 'input-error' : ''}`}
                          {...passwordForm.register('confirmPassword')}
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordForm.formState.errors.confirmPassword && (
                        <label className="label">
                          <span className="label-text-alt text-error">{passwordForm.formState.errors.confirmPassword.message}</span>
                        </label>
                      )}
                    </div>
                  </>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={passwordForm.formState.isSubmitting || (!passwordVerified && !passwordForm.getValues('currentPassword'))}
                >
                  {!passwordVerified 
                    ? 'Verify Password First' 
                    : passwordForm.formState.isSubmitting 
                      ? 'Updating...' 
                      : 'Update Password'}
                </button>
              </form>
            </div>
          )}
          
          {/* Preferences Tab - unchanged
          {activeTab === 'preferences' && (
            
            <div>
              <h2 className="text-xl font-semibold mb-4">User Preferences</h2>

              <p className="text-gray-500">
                Notification and display preferences will appear here.
              </p>
              
              
              <div className="mt-6 space-y-4">
                <div className="form-control">
                  <label className="cursor-pointer label justify-start gap-4">
                    <input type="checkbox" className="toggle toggle-primary" />
                    <span className="label-text">Email notifications</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="cursor-pointer label justify-start gap-4">
                    <input type="checkbox" className="toggle toggle-primary" />
                    <span className="label-text">Push notifications</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="cursor-pointer label justify-start gap-4">
                    <input type="checkbox" className="toggle toggle-primary" />
                    <span className="label-text">Monthly report summary</span>
                  </label>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Settings;
