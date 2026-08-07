////////////////////////////////////////
// alerts

// Using iziToast for alerts
function showAlert(type, msg) {
  // Map custom alert types to iziToast methods
  const iziToastTypes = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  const status = iziToastTypes[type] || 'info';

  // Show the iziToast notification
  iziToast[status]({
    message: msg,
    position: 'topRight',
    timeout: 5000, // Display for 5 seconds
  });
}

const signUp = async (
  firstName,
  lastName,
  email,
  username,
  country,
  phoneNumber,
  referral,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        firstName,
        lastName,
        email,
        username,
        country,
        phoneNumber,
        referral,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/sign-in');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password reset email sent!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const resetPassword = async (password, passwordConfirm, resetToken) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${resetToken}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully reset password');

      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.assign('/sign-in');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/dashboard');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const adminLogin = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login/admin',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/admin/dashboard');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const deposit = async (formData) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/transactions/deposit',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Success! Wait for payment confirmation.');
      window.setTimeout(() => {
        location.assign('/transaction-logs');
      }, 3000);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

const updateUserData = async (formData) => {
  try {
    const res = await axios({
      method: 'patch',
      url: '/api/v1/users/update',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Success! Wait for payment confirmation.');
      window.setTimeout(() => {
        location.reload();
      }, 3000);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

const kyc = async (formData) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/kyc/upload-kyc',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Success! Wait for verification.');
      window.setTimeout(() => {
        location.reload();
      }, 3000);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

const withdraw = async (amount, address, wallet) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/transactions/withdraw',
      data: {
        amount,
        address,
        wallet,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Success! Wait for withdraw confirmation.');
      window.setTimeout(() => {
        location.assign('/transaction-logs');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const sendMoney = async (wallet, amount) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/transactions/transfer',
      data: {
        wallet,
        amount,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Funds have been transferred successfully!');
      window.setTimeout(() => {
        location.assign('/transaction-logs');
      }, 3000);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

const updateAdminPassword = async (
  passwordCurrent,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'patch',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');

      window.setTimeout(() => {
        location.reload();
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const exchange = async (from, to, amount) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/transactions/exchange',
      data: {
        from,
        to,
        amount,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Exchange successful!');

      window.setTimeout(() => {
        location.reload();
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const invest = async (plan, amount) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/investments/invest',
      data: {
        plan,
        amount,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Investment successful!');

      window.setTimeout(() => {
        location.assign('/investment-logs');
      }, 3000);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

const createPlan = async (name, min, max, roi, duration) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/plans/create-plan',
      data: {
        name,
        min,
        max,
        roi,
        duration,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Created plan successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.reload();
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const addWallet = async (name, address) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/wallets/create-wallet',
      data: {
        name,
        address,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Wallet added successfully!');
      // Redirect to the login page after a delay
      window.setTimeout(() => {
        location.reload();
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const supportFaq = async (name, email, subject, message) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/supports/send-support',
      data: {
        name,
        email,
        subject,
        message,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Message sent successfully!');

      window.setTimeout(() => {
        location.reload();
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const logoutUser = async () => {
  try {
    const res = await axios({
      method: 'get',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      setTimeout(function () {
        location.href = '/';
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const loginForm = document.querySelector('.form-login');
const adminLoginForm = document.querySelector('.admin-form-login');
const signupForm = document.querySelector('.form-signup');
const depositForm = document.querySelector('.deposit-form');
const withdrawalForm = document.querySelector('.withdrawal-form');
const forgotPasswordButton = document.querySelector('.form-forgot-password');
const resetPasswordButton = document.querySelector('.form-reset-password');
const transferForm = document.querySelector('.transfer-form');
const userForm = document.querySelector('.user-form');
const supportFormFaq = document.querySelector('.support-form-faq');
const updateAdminPasswordForm = document.querySelector('.admin-password-form');
const kycForm = document.querySelector('.kyc-form');
const exchangeForm = document.querySelector('.exchange-form');
const investmentForm = document.querySelector('.investment-form');
const createPlanForm = document.querySelector('.add-plan-form');
const addWalletForm = document.querySelector('.add-wallet-form');
const logoutUserBtn = document.querySelectorAll('.signOut-user-btn');

if (supportFormFaq) {
  supportFormFaq.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = document.querySelector('.submit-btn');

    button.style.opacity = '0.5';
    button.textContent = 'Sending...';
    button.disabled = true;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    await supportFaq(name, email, subject, message);
    button.style.opacity = '1';
    button.textContent = 'Send Message';
    button.disabled = false;
  });
}

if (logoutUserBtn) {
  logoutUserBtn.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      await logoutUser();
    });
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.admin-login-btn').style.opacity = '0.5';
    document.querySelector('.admin-login-btn').textContent = 'Signing in...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
    document.querySelector('.admin-login-btn').style.opacity = '1';
    document.querySelector('.admin-login-btn').textContent = 'Sign in';
  });
}

if (createPlanForm) {
  createPlanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.submit-btn').style.opacity = '0.5';
    document.querySelector('.submit-btn').ariaDisabled = true;
    document.querySelector('.submit-btn').textContent = 'Processing...';
    const name = document.getElementById('name').value;
    const min = document.getElementById('min').value;
    const max = document.getElementById('max').value;
    const roi = document.getElementById('roi').value;
    const duration = document.getElementById('duration').value;

    await createPlan(name, min, max, roi, duration);
    document.querySelector('.submit-btn').style.opacity = '1';
    document.querySelector('.submit-btn').ariaDisabled = false;
    document.querySelector('.submit-btn').textContent = 'Add';
  });
}

if (addWalletForm) {
  addWalletForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.submit-btn').style.opacity = '0.5';
    document.querySelector('.submit-btn').ariaDisabled = true;
    document.querySelector('.submit-btn').textContent = 'Processing...';
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    await addWallet(name, address);
    document.querySelector('.submit-btn').style.opacity = '1';
    document.querySelector('.submit-btn').ariaDisabled = false;
    document.querySelector('.submit-btn').textContent = 'Add Wallet';
  });
}

if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.admin-login-btn').style.opacity = '0.5';
    document.querySelector('.admin-login-btn').textContent = 'Signing in...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await adminLogin(email, password);
    document.querySelector('.admin-login-btn').style.opacity = '1';
    document.querySelector('.admin-login-btn').textContent = 'Sign in';
  });
}

if (updateAdminPasswordForm) {
  updateAdminPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = document.querySelector('.submit-btn3');
    button.style.opacity = '0.5';
    button.textContent = 'Saving...';
    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    await updateAdminPassword(passwordCurrent, password, passwordConfirm);
    button.style.opacity = '1';
    button.textContent = 'Change Password';
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--signup').style.opacity = '0.5';
    document.querySelector('.btn--signup').textContent = 'signing up...';

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const country = document.getElementById('country').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const referral = document.getElementById('referralCode').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    await signUp(
      firstName,
      lastName,
      email,
      username,
      country,
      phoneNumber,
      referral,
      password,
      passwordConfirm
    );
    document.querySelector('.btn--signup').style.opacity = '1';
    document.querySelector('.btn--signup').textContent = 'sign up';
  });
}

if (investmentForm) {
  investmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');

    submitBtn.textContent = 'Processing...';
    submitBtn.ariaDisabled = true;
    submitBtn.style.opacity = '0.5';

    const plan = document.getElementById('plan').value;
    const amount = document.getElementById('amount').value;

    await invest(plan, amount);

    submitBtn.textContent = 'Invest Now';
    submitBtn.ariaDisabled = false;
    submitBtn.style.opacity = '1';
  });
}

if (forgotPasswordButton) {
  forgotPasswordButton.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--forgot').style.opacity = '0.5';
    document.querySelector('.btn--forgot').textContent =
      'Sending reset link...';

    const email = document.getElementById('email').value;

    await forgotPassword(email);

    document.querySelector('.btn--forgot').style.opacity = '1';
    document.querySelector('.btn--forgot').textContent =
      'Send password reset email';
  });
}

if (resetPasswordButton) {
  resetPasswordButton.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--reset').style.opacity = '0.5';
    document.querySelector('.btn--reset').textContent = 'Resetting password...';

    // Get the resetToken from the URL parameters
    const urlParams = window.location.pathname.split('/').pop();

    // Get the password and passwordConfirm from the form fields
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    // Call the resetPassword function with the obtained resetToken
    await resetPassword(password, passwordConfirm, urlParams);

    document.querySelector('.btn--reset').style.opacity = '1';
    document.querySelector('.btn--reset').textContent = 'Reset password';
  });
}

if (exchangeForm) {
  exchangeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');

    submitBtn.textContent = 'Processing...';
    submitBtn.ariaDisabled = true;
    submitBtn.style.opacity = '0.5';

    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const amount = document.getElementById('amount').value;

    await exchange(from, to, amount);

    submitBtn.textContent = 'Exchange';
    submitBtn.ariaDisabled = false;
    submitBtn.style.opacity = '1';
  });
}

if (depositForm) {
  depositForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');

    submitBtn.textContent = 'Processing...';
    submitBtn.ariaDisabled = true;
    submitBtn.style.opacity = '0.5';

    const formData = new FormData();

    formData.append('amount', document.getElementById('amount').value);
    formData.append(
      'address',
      document.getElementById('showAddress').textContent
    );
    formData.append('plan', document.getElementById('plan').value);
    formData.append(
      'paymentMethod',
      document.getElementById('paymentMethod').value
    );
    formData.append('wallet', document.getElementById('walletName').value);
    formData.append(
      'paymentProof',
      document.getElementById('paymentProof').files[0]
    );

    await deposit(formData);

    submitBtn.textContent = 'Complete Payment';
    submitBtn.ariaDisabled = false;
    submitBtn.style.opacity = '1';
  });
}

if (kycForm) {
  kycForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn2');

    submitBtn.textContent = 'Uploading...';
    submitBtn.ariaDisabled = true;
    submitBtn.style.opacity = '0.5';

    const formData = new FormData();

    formData.append('front', document.getElementById('front').files[0]);
    formData.append('back', document.getElementById('back').files[0]);

    await kyc(formData);

    submitBtn.textContent = 'Upload Kyc';
    submitBtn.ariaDisabled = false;
    submitBtn.style.opacity = '1';
  });
}

if (userForm) {
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');

    submitBtn.textContent = 'Processing...';
    submitBtn.ariaDisabled = true;
    submitBtn.style.opacity = '0.5';

    const formData = new FormData();

    formData.append('firstName', document.getElementById('firstName').value);
    formData.append('lastName', document.getElementById('lastName').value);
    formData.append(
      'dateOfBirth',
      document.getElementById('dateOfBirth').value
    );
    formData.append('address', document.getElementById('address').value);
    formData.append('username', document.getElementById('username').value);
    formData.append('gender', document.getElementById('gender').value);
    formData.append(
      'phoneNumber',
      document.getElementById('phoneNumber').value
    );
    formData.append('country', document.getElementById('country').value);
    formData.append('city', document.getElementById('city').value);
    formData.append('zip', document.getElementById('zip').value);
    formData.append(
      'paymentProof',
      document.getElementById('imageCover').files[0]
    );

    await updateUserData(formData);

    submitBtn.textContent = 'Update';
    submitBtn.ariaDisabled = false;
    submitBtn.style.opacity = '1';
  });
}

if (withdrawalForm) {
  withdrawalForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Processing...';
    submitBtn.ariaDisabled = true;
    submitBtn.style.opacity = '0.5';

    const amount = document.getElementById('amount').value;
    const wallet = document.getElementById('wallet').value;
    const address = document.getElementById('address').value;

    await withdraw(amount, address, wallet);

    submitBtn.textContent = 'Complete Withdrawal';
    submitBtn.ariaDisabled = false;
    submitBtn.style.opacity = '1';
  });
}

if (transferForm) {
  transferForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Processing...';
    submitBtn.ariaDisabled = true;
    submitBtn.style.opacity = '0.5';

    const wallet = document.getElementById('email').value;
    const amount = document.getElementById('amount').value;

    await sendMoney(wallet, amount);

    submitBtn.textContent = 'Complete Transaction';
    submitBtn.ariaDisabled = false;
    submitBtn.style.opacity = '1';
  });
}

const confirmTransactionBtn = document.querySelectorAll('.approve-btn');
const declineTransactionBtn = document.querySelectorAll('.decline-btn');

if (confirmTransactionBtn) {
  confirmTransactionBtn.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const transactionId = button.dataset.transactionId;

      button.textContent = 'Processing...';
      button.opacity = '0.5';
      button.ariaDisabled = true;

      try {
        const res = await axios.patch(
          `/api/v1/transactions/confirm-transaction/${transactionId}`
        );

        if (res.data.status === 'success') {
          showAlert('success', 'Transaction confirmed successfully!');
          button.textContent = 'Approve';
          button.opacity = '1';
          button.ariaDisabled = false;

          window.setTimeout(() => {
            location.reload();
          }, 3000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        button.textContent = 'Approve';
        button.opacity = '1';
        button.ariaDisabled = false;
      }
    });
  });
}

if (declineTransactionBtn) {
  declineTransactionBtn.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const transactionId = button.dataset.transactionId;

      button.textContent = 'Processing...';
      button.opacity = '0.5';
      button.ariaDisabled = true;

      try {
        const res = await axios.patch(
          `/api/v1/transactions/decline-transaction/${transactionId}`
        );

        if (res.data.status === 'success') {
          showAlert('success', 'Transaction declined successfully!');
          button.textContent = 'Decline';
          button.opacity = '1';
          button.ariaDisabled = false;

          window.setTimeout(() => {
            location.reload();
          }, 3000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        button.textContent = 'Decline';
        button.opacity = '1';
        button.ariaDisabled = false;
      }
    });
  });
}

const confirmKycBtn = document.querySelectorAll('.approve-kyc-btn');
const declineKycBtn = document.querySelectorAll('.decline-kyc-btn');

if (confirmKycBtn) {
  confirmKycBtn.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const kycId = button.dataset.kycId;

      button.textContent = 'Processing...';
      button.opacity = '0.5';
      button.ariaDisabled = true;

      try {
        const res = await axios.patch(`/api/v1/kyc/approve-kyc/${kycId}`);

        if (res.data.status === 'success') {
          showAlert('success', 'Kyc verified successfully!');
          button.textContent = 'Approve';
          button.opacity = '1';
          button.ariaDisabled = false;

          window.setTimeout(() => {
            location.reload();
          }, 3000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        button.textContent = 'Approve';
        button.opacity = '1';
        button.ariaDisabled = false;
      }
    });
  });
}

if (declineKycBtn) {
  declineKycBtn.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const kycId = button.dataset.kycId;

      button.textContent = 'Processing...';
      button.opacity = '0.5';
      button.ariaDisabled = true;

      try {
        const res = await axios.patch(`/api/v1/kyc/decline-kyc/${kycId}`);

        if (res.data.status === 'success') {
          showAlert('success', 'Kyc declined successfully!');
          button.textContent = 'Decline';
          button.opacity = '1';
          button.ariaDisabled = false;

          window.setTimeout(() => {
            location.reload();
          }, 3000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
        button.textContent = 'Decline';
        button.opacity = '1';
        button.ariaDisabled = false;
      }
    });
  });
}

const editPlanModal = document.querySelectorAll('.edit-plan-modal-btn');
const editPlanBtn = document.querySelector('.edit-plan-btn');
let currentPlanId = null;

editPlanModal.forEach((button) => {
  button.addEventListener('click', function () {
    currentPlanId = this.dataset.planId;
  });
});

if (editPlanBtn) {
  editPlanBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!currentPlanId) return;

    editPlanBtn.style.opacity = '0.5';
    editPlanBtn.ariaDisabled = true;
    editPlanBtn.textContent = 'Processing...';

    const info = {
      name: document.getElementById('name').value,
      min: document.getElementById('min').value,
      max: document.getElementById('max').value,
      roi: document.getElementById('roi').value,
      duration: document.getElementById('duration').value,
    };

    try {
      const response = await axios.patch(
        `/api/v1/plans/edit-plan/${currentPlanId}`,
        info
      );

      if (response.data.status === 'success') {
        showAlert('success', 'Plan updated successfully!');
        window.setTimeout(() => {
          location.reload();
        }, 3000);
      }
    } catch (err) {
      showAlert(
        'error',
        err.response ? err.response.data.message : 'Error updating plan'
      );
    } finally {
      editEditorBtn.style.opacity = '1';
      editEditorBtn.disabled = false;
      editEditorBtn.textContent = 'Save changes';
    }
  });
}

const editWalletModal = document.querySelectorAll('.edit-wallet-modal-btn');
const editWalletBtn = document.querySelector('.edit-wallet-btn');
let currentWalletId = null;

editWalletModal.forEach((button) => {
  button.addEventListener('click', function () {
    currentWalletId = this.dataset.walletId;
  });
});

if (editWalletBtn) {
  editWalletBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!currentWalletId) return;

    editWalletBtn.style.opacity = '0.5';
    editWalletBtn.ariaDisabled = true;
    editWalletBtn.textContent = 'Processing...';

    const info = {
      name: document.getElementById('name').value,
      address: document.getElementById('address').value,
    };

    try {
      const response = await axios.patch(
        `/api/v1/wallets/edit-wallet/${currentWalletId}`,
        info
      );

      if (response.data.status === 'success') {
        showAlert('success', 'Wallet updated successfully!');
        window.setTimeout(() => {
          location.reload();
        }, 3000);
      }
    } catch (err) {
      showAlert(
        'error',
        err.response ? err.response.data.message : 'Error updating wallet'
      );
    } finally {
      editWalletBtn.style.opacity = '1';
      editWalletBtn.disabled = false;
      editWalletBtn.textContent = 'Save changes';
    }
  });
}

let currentUserId = null;

const automaticModalBtn = document.querySelectorAll('.automatic-modal-btn');
const automaticBtn = document.querySelector('.automatic-btn');

automaticModalBtn.forEach((button) => {
  button.addEventListener('click', function () {
    currentUserId = this.dataset.userId;
  });
});

if (automaticBtn) {
  automaticBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!currentUserId) return;

    automaticBtn.style.opacity = '0.5';
    automaticBtn.ariaDisabled = true;
    automaticBtn.textContent = 'Processing...';

    const info = {
      amount: document.getElementById('amount').value,
      type: document.getElementById('type').value,
      wallet: document.getElementById('wallet').value,
    };

    try {
      const response = await axios.post(
        `/api/v1/transactions/direct-deposit/${currentUserId}`,
        info
      );

      if (response.data.status === 'success') {
        showAlert('success', 'success!');
        window.setTimeout(() => {
          location.reload();
        }, 3000);
      }
    } catch (err) {
      showAlert(
        'error',
        err.response ? err.response.data.message : 'Error updating user balance'
      );
    } finally {
      automaticBtn.style.opacity = '1';
      automaticBtn.disabled = false;
      automaticBtn.textContent = 'Save changes';
    }
  });
}

const editUserModalBtn = document.querySelectorAll('.edit-user-modal-btn');
const editUserBtn = document.querySelector('.edit-user-btn');

editUserModalBtn.forEach((button) => {
  button.addEventListener('click', function () {
    currentUserId = this.dataset.userId;
  });
});

if (editUserBtn) {
  editUserBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!currentUserId) return;

    editUserBtn.style.opacity = '0.5';
    editUserBtn.ariaDisabled = true;
    editUserBtn.textContent = 'Processing...';

    const info = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      role: document.getElementById('role').value,
      username: document.getElementById('username').value,
      country: document.getElementById('country').value,
      gender: document.getElementById('gender').value,
      phoneNumber: document.getElementById('phoneNumber').value,
      city: document.getElementById('city').value,
      zip: document.getElementById('zip').value,
      address: document.getElementById('address').value,
      status: document.getElementById('status').value,
      depositStatus: document.getElementById('depositStatus').value,
      withdrawalStatus: document.getElementById('withdrawalStatus').value,
      sendMoneyStatus: document.getElementById('sendMoneyStatus').value,
      kycStatus: document.getElementById('kycStatus').value,
    };

    try {
      const response = await axios.patch(
        `/api/v1/users/admin-edit-user-data/${currentUserId}`,
        info
      );

      if (response.data.status === 'success') {
        showAlert('success', 'success!');
        window.setTimeout(() => {
          location.reload();
        }, 3000);
      }
    } catch (err) {
      showAlert(
        'error',
        err.response ? err.response.data.message : 'Error updating user data'
      );
    } finally {
      editUserBtn.style.opacity = '1';
      editUserBtn.disabled = false;
      editUserBtn.textContent = 'Save changes';
    }
  });
}

const sendMailModal = document.querySelectorAll('.send-mail-modal-btn');
const sendMailBtn = document.querySelector('.send-mail-btn');

sendMailModal.forEach((button) => {
  button.addEventListener('click', function () {
    currentUserId = this.dataset.userId;
  });
});

if (sendMailBtn) {
  sendMailBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!currentUserId) return;

    sendMailBtn.style.opacity = '0.5';
    sendMailBtn.ariaDisabled = true;
    sendMailBtn.textContent = 'Sending...';

    const info = {
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
    };

    try {
      const response = await axios.post(
        `/api/v1/supports/send-mail/${currentUserId}`,
        info
      );

      if (response.data.status === 'success') {
        showAlert('success', 'Mail sent successfully!');
        window.setTimeout(() => {
          location.reload();
        }, 3000);
      }
    } catch (err) {
      showAlert(
        'error',
        err.response ? err.response.data.message : 'Error sending mail'
      );
    } finally {
      sendMailBtn.style.opacity = '1';
      sendMailBtn.disabled = false;
      sendMailBtn.textContent = 'Send Mail';
    }
  });
}

const replySupport = document.querySelectorAll('.send-mail-modal-btn');
const sendReplyBtn = document.querySelector('.send-mail-btn');
let currentSupportId = null;

replySupport.forEach((button) => {
  button.addEventListener('click', function () {
    currentSupportId = this.dataset.supportId;
  });
});

if (sendReplyBtn) {
  sendReplyBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!currentSupportId) return;

    sendReplyBtn.style.opacity = '0.5';
    sendReplyBtn.ariaDisabled = true;
    sendReplyBtn.textContent = 'Sending...';

    const info = {
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
    };

    try {
      const response = await axios.post(
        `/api/v1/supports/reply-support/${currentSupportId}`,
        info
      );

      if (response.data.status === 'success') {
        showAlert('success', 'Mail sent successfully!');
        window.setTimeout(() => {
          location.reload();
        }, 3000);
      }
    } catch (err) {
      showAlert(
        'error',
        err.response ? err.response.data.message : 'Error sending mail'
      );
    } finally {
      sendReplyBtn.style.opacity = '1';
      sendReplyBtn.disabled = false;
      sendReplyBtn.textContent = 'Send Mail';
    }
  });
}

const selectWallet = document.getElementById('walletName');
const showAddress = document.getElementById('showAddress');
const walletBlock = document.getElementById('walletBlock');
const selectBlock = document.getElementById('selectBlock');
const amountTotal = document.getElementById('amountTotal');
const charge = document.getElementById('charge');
const paymentMethod = document.getElementById('paymentMethod');
const finalTotal = document.getElementById('total');
const depositAmount = document.getElementById('amount');
const transferEmail = document.getElementById('user');
const inputEmail = document.getElementById('email');
const inputAmount = document.getElementById('amount');
const planSelect = document.getElementById('plan');
const min = document.getElementById('min');
const max = document.getElementById('max');
const interest = document.getElementById('interest');
const duration = document.getElementById('duration');
const investAmount = document.getElementById('amount');

if (selectWallet) {
  selectWallet.addEventListener('change', async (e) => {
    e.preventDefault();

    walletBlock.style.display = 'block';
    showAddress.textContent = 'Fetching wallet address...';
    showAddress.style.color = 'black';

    const walletName = selectWallet.value;

    const res = await fetch(`/api/v1/wallets/get-address/${walletName}`);

    const data = await res.json();

    if (data.status === 'success') {
      walletBlock.style.display = 'block';
      showAddress.textContent = data.data.wallet.address;
      showAddress.style.color = 'white';
    }
  });
}

if (paymentMethod) {
  paymentMethod.addEventListener('change', (e) => {
    e.preventDefault();

    if (paymentMethod.value === 'wallet') {
      selectBlock.style.display = 'block';
    } else {
      selectBlock.style.display = 'none';
      walletBlock.style.display = 'none';
    }
  });
}

if (depositAmount) {
  depositAmount.addEventListener('input', (e) => {
    e.preventDefault();

    charge.textContent = '0 USD';
    finalTotal.textContent = depositAmount.value + ' USD';
    amountTotal.textContent = depositAmount.value + ' USD';
  });
}

if (inputEmail) {
  inputEmail.addEventListener('input', (e) => {
    e.preventDefault();

    transferEmail.textContent = inputEmail.value;
  });
}

if (inputAmount) {
  inputAmount.addEventListener('input', (e) => {
    e.preventDefault();

    charge.textContent = '0 USD';
    finalTotal.textContent =
      parseInt(inputAmount.value) +
      (0.2 / 100) * parseInt(inputAmount.value) +
      'USD';
  });
}

if (planSelect) {
  planSelect.addEventListener('change', async (e) => {
    e.preventDefault();

    const plan = planSelect.value;

    const res = await fetch(`/api/v1/plans/get-plan/${plan}`);

    const data = await res.json();

    if (data.status === 'success') {
      min.textContent = data.data.plan.min;
      max.textContent = data.data.plan.max;
      duration.textContent = data.data.plan.duration + ' Days';
      interest.textContent = data.data.plan.roi + '%';
    }
  });
}

if (investAmount) {
  investAmount.addEventListener('input', (e) => {
    e.preventDefault();

    finalTotal.textContent = investAmount.value + ' USD';
  });
}
