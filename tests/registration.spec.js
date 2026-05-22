// @ts-check
const { test, expect } = require("@playwright/test");
const { RegistrationPage } = require("../pageObjects/registrationPage");
const registrationData = require("../fixtures/registrationData.json");

const getUniqueEmail = () => `aqa-${Date.now()}@test.com`;

test.describe("Registration", () => {
  /** @type {RegistrationPage} */
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.open();
  });

  test("displays registration form fields", async () => {
    await registrationPage.assertFormFieldsVisible();
  });

  test("registers a new user with valid data", async () => {
    await registrationPage.fillForm({
      name: registrationData.validName,
      lastName: registrationData.validLastName,
      email: getUniqueEmail(),
      password: registrationData.validPassword,
      repeatPassword: registrationData.validPassword,
    });

    await registrationPage.submitForm();
    await registrationPage.assertSuccessfulRegistration();
  });

  test("validates required Name field", async () => {
    const nameInput = registrationPage.getNameInput();

    await nameInput.focus();
    await nameInput.blur();

    await registrationPage.assertInvalidField(nameInput, registrationData.nameRequiredError);
  });

  test("validates invalid Name field", async () => {
    const nameInput = registrationPage.getNameInput();

    await nameInput.fill(registrationData.invalidName);
    await nameInput.blur();

    await registrationPage.assertInvalidField(nameInput, registrationData.nameInvalidError);
  });

  test("validates Name field length", async () => {
    const nameInput = registrationPage.getNameInput();

    await nameInput.fill(registrationData.shortName);
    await nameInput.blur();

    await registrationPage.assertInvalidField(nameInput, registrationData.nameLengthError);

    await nameInput.fill(registrationData.longName);
    await nameInput.blur();

    await registrationPage.assertInvalidField(nameInput, registrationData.nameLengthError);
  });

  test("validates required Last name field", async () => {
    const lastNameInput = registrationPage.getLastNameInput();

    await lastNameInput.focus();
    await lastNameInput.blur();

    await registrationPage.assertInvalidField(lastNameInput, registrationData.lastNameRequiredError);
  });

  test("validates Last name field format and length", async () => {
    const lastNameInput = registrationPage.getLastNameInput();

    await lastNameInput.fill(registrationData.invalidLastName);
    await lastNameInput.blur();

    await registrationPage.assertInvalidField(lastNameInput, registrationData.lastNameInvalidError);

    await lastNameInput.fill(registrationData.shortLastName);
    await lastNameInput.blur();

    await registrationPage.assertInvalidField(lastNameInput, registrationData.lastNameLengthError);

    await lastNameInput.fill(registrationData.longLastName);
    await lastNameInput.blur();

    await registrationPage.assertInvalidField(lastNameInput, registrationData.lastNameLengthError);
  });

  test("validates required Email field", async () => {
    const emailInput = registrationPage.getEmailInput();

    await emailInput.focus();
    await emailInput.blur();

    await registrationPage.assertInvalidField(emailInput, registrationData.emailRequiredError);
  });

  test("validates invalid Email field", async () => {
    const emailInput = registrationPage.getEmailInput();

    await emailInput.fill(registrationData.invalidEmail);
    await emailInput.blur();

    await registrationPage.assertInvalidField(emailInput, registrationData.emailIncorrectError);
  });

  test("validates invalid Password field", async () => {
    const passwordInput = registrationPage.getPasswordInput();

    await passwordInput.fill(registrationData.invalidPassword);
    await passwordInput.blur();

    await registrationPage.assertInvalidField(passwordInput, registrationData.passwordInvalidError);
  });

  test("validates password mismatch", async () => {
    const passwordInput = registrationPage.getPasswordInput();
    const repeatPasswordInput = registrationPage.getRepeatPasswordInput();

    await passwordInput.fill(registrationData.validPassword);
    await repeatPasswordInput.fill(registrationData.mismatchedPassword);
    await repeatPasswordInput.blur();

    await registrationPage.assertInvalidField(
      repeatPasswordInput,
      registrationData.passwordsDoNotMatchError,
    );
  });

  test("keeps Register button disabled for invalid form", async () => {
    const registerButton = registrationPage.getRegisterButton();

    await registrationPage.fillForm({
      name: registrationData.validName,
      lastName: registrationData.validLastName,
      email: registrationData.invalidEmailForDisabledForm,
      password: registrationData.validPassword,
      repeatPassword: registrationData.validPassword,
    });

    await expect(registerButton).toBeDisabled();
  });
});
