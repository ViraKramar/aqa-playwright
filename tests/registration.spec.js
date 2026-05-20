// @ts-check
const { test, expect } = require("@playwright/test");

const validPassword = "Test1234";

const openRegistrationModal = async (page) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page.getByRole("heading", { name: "Registration" })).toBeVisible();
};

const registrationForm = (page) => {
  const form = page.getByRole("dialog").filter({ hasText: "Registration" });

  return {
    form,
    nameInput: form.locator("#signupName"),
    lastNameInput: form.locator("#signupLastName"),
    emailInput: form.locator("#signupEmail"),
    passwordInput: form.locator("#signupPassword"),
    repeatPasswordInput: form.locator("#signupRepeatPassword"),
    registerButton: form.getByRole("button", { name: "Register" }),
    error: (text) => form.getByText(text),
  };
};

const fillRegistrationForm = async (page, userData) => {
  const { nameInput, lastNameInput, emailInput, passwordInput, repeatPasswordInput } =
    registrationForm(page);

  await nameInput.fill(userData.name);
  await lastNameInput.fill(userData.lastName);
  await emailInput.fill(userData.email);
  await passwordInput.fill(userData.password);
  await repeatPasswordInput.fill(userData.repeatPassword);
};

const getUniqueEmail = () => `aqa-${Date.now()}@test.com`;

test.describe("Registration", () => {
  test.beforeEach(async ({ page }) => {
    await openRegistrationModal(page);
  });

  test("displays registration form fields", async ({ page }) => {
    const {
      nameInput,
      lastNameInput,
      emailInput,
      passwordInput,
      repeatPasswordInput,
      registerButton,
    } = registrationForm(page);

    await expect(nameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(repeatPasswordInput).toBeVisible();
    await expect(registerButton).toBeVisible();
  });

  test("registers a new user with valid data", async ({ page }) => {
    const { registerButton } = registrationForm(page);

    await fillRegistrationForm(page, {
      name: "John",
      lastName: "Doe",
      email: getUniqueEmail(),
      password: validPassword,
      repeatPassword: validPassword,
    });

    await expect(registerButton).toBeEnabled();
    await registerButton.click();

    await expect(page).toHaveURL(/\/panel\/garage/);
    await expect(page.getByRole("heading", { name: "Garage" })).toBeVisible();
    await expect(page.getByRole("button", { name: "My profile" })).toBeVisible();
  });

  test("validates required Name field", async ({ page }) => {
    const { nameInput, error } = registrationForm(page);

    await nameInput.focus();
    await nameInput.blur();

    await expect(error("Name required")).toBeVisible();
    await expect(nameInput).toHaveClass(/is-invalid|ng-invalid/);
  });

  test("validates invalid Name field", async ({ page }) => {
    const { nameInput, error } = registrationForm(page);

    await nameInput.fill("John1");
    await nameInput.blur();

    await expect(error("Name is invalid")).toBeVisible();
    await expect(nameInput).toHaveClass(/is-invalid|ng-invalid/);
  });

  test("validates Name field length", async ({ page }) => {
    const { nameInput, error } = registrationForm(page);

    await nameInput.fill("A");
    await nameInput.blur();

    await expect(error("Name has to be from 2 to 20 characters long")).toBeVisible();

    await nameInput.fill("ABCDEFGHIJKLMNOPQRSTU");
    await nameInput.blur();

    await expect(error("Name has to be from 2 to 20 characters long")).toBeVisible();
  });

  test("validates required Last name field", async ({ page }) => {
    const { lastNameInput, error } = registrationForm(page);

    await lastNameInput.focus();
    await lastNameInput.blur();

    await expect(error("Last name required")).toBeVisible();
    await expect(lastNameInput).toHaveClass(/is-invalid|ng-invalid/);
  });

  test("validates Last name field format and length", async ({ page }) => {
    const { lastNameInput, error } = registrationForm(page);

    await lastNameInput.fill("Doe1");
    await lastNameInput.blur();

    await expect(error("Last name is invalid")).toBeVisible();
    await expect(lastNameInput).toHaveClass(/is-invalid|ng-invalid/);

    await lastNameInput.fill("D");
    await lastNameInput.blur();

    await expect(error("Last name has to be from 2 to 20 characters long")).toBeVisible();

    await lastNameInput.fill("ABCDEFGHIJKLMNOPQRSTU");
    await lastNameInput.blur();

    await expect(error("Last name has to be from 2 to 20 characters long")).toBeVisible();
  });

  test("validates required Email field", async ({ page }) => {
    const { emailInput, error } = registrationForm(page);

    await emailInput.focus();
    await emailInput.blur();

    await expect(error("Email required")).toBeVisible();
    await expect(emailInput).toHaveClass(/is-invalid|ng-invalid/);
  });

  test("validates invalid Email field", async ({ page }) => {
    const { emailInput, error } = registrationForm(page);

    await emailInput.fill("john");
    await emailInput.blur();

    await expect(error("Email is incorrect")).toBeVisible();
    await expect(emailInput).toHaveClass(/is-invalid|ng-invalid/);
  });

  test("validates invalid Password field", async ({ page }) => {
    const { passwordInput, error } = registrationForm(page);

    await passwordInput.fill("short");
    await passwordInput.blur();

    await expect(
      error(
        "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter",
      ),
    ).toBeVisible();

    await expect(passwordInput).toHaveClass(/is-invalid|ng-invalid/);
  });

  test("validates password mismatch", async ({ page }) => {
    const { passwordInput, repeatPasswordInput, error } = registrationForm(page);

    await passwordInput.fill(validPassword);
    await repeatPasswordInput.fill("Test12345");
    await repeatPasswordInput.blur();

    await expect(error("Passwords do not match")).toBeVisible();
    await expect(repeatPasswordInput).toHaveClass(/is-invalid|ng-invalid/);
  });

  test("keeps Register button disabled for invalid form", async ({ page }) => {
    const {
      nameInput,
      lastNameInput,
      emailInput,
      passwordInput,
      repeatPasswordInput,
      registerButton,
    } = registrationForm(page);

    await nameInput.fill("John");
    await lastNameInput.fill("Doe");
    await emailInput.fill("invalid-email");
    await passwordInput.fill(validPassword);
    await repeatPasswordInput.fill(validPassword);

    await expect(registerButton).toBeDisabled();
  });
});
