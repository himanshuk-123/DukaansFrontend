# Dukaan Frontend - React Native E-commerce App

## Project Overview

Dukaan is a full-featured e-commerce mobile application built with React Native that connects local shops and customers. The application provides a seamless shopping experience with features like product browsing, authentication, cart management, checkout, and order tracking.

## Recent Implementation: Authentication Flow & Cart Integration

### Authentication System

Recently implemented a comprehensive authentication flow that includes:

- **User Registration**: Complete signup flow with validation and success redirection
- **User Login**: JWT-based authentication with secure token storage
- **Token Management**: Automatic token inclusion in API requests via Axios interceptors
- **Profile Management**: Real-time user data fetching for the profile screen
- **Guest Mode**: Allow browsing without authentication, but require login for actions like adding to cart

### Cart Functionality

Integrated the cart system with authentication to provide:

- **Auth-Protected Actions**: Authentication check before cart operations
- **Login Modal**: Modern interactive login prompt for guest users
- **Backend Integration**: Full integration with cart API endpoints
- **State Management**: Comprehensive cart state management with Context API
- **Persistent Cart**: Cart data is preserved between sessions for authenticated users

### Technical Implementation Details

1. **Auth Service (`auth.js`)**
   - Implemented API calls for login, registration, logout, and profile
   - Added token storage with AsyncStorage
   - Added error handling and consistent response formatting

2. **Cart Service (`cart.js`)**
   - Created service for cart API operations
   - Implemented methods for adding, removing, updating cart items
   - Added proper error handling and response formatting

3. **Auth Context (`AuthContext.js`)**
   - Global state management for authentication
   - User state persistence between app sessions
   - Login, registration, and logout functionality

4. **Cart Context (`CartContext.js`)**
   - Global state management for cart operations
   - Integration with authentication state
   - Navigation state management for redirection after login

5. **Login Modal (`LoginPromptModal.jsx`)**
   - Modern UI component for login/signup prompts
   - Appears when guest users attempt restricted actions
   - Options to login, signup, or continue as guest

6. **Product Detail Screen (`ProductDetailScreen.jsx`)**
   - Authentication check before adding to cart
   - Integration with login modal for guest users
   - Cart operation state management

## Technologies Used

- **React Native**: Core UI framework
- **React Navigation**: Screen navigation
- **AsyncStorage**: Persistent data storage
- **Axios**: API requests with interceptors for auth tokens
- **Context API**: Global state management

## Installation

1. Clone the repository
   ```
   git clone https://github.com/himanshuk-123/DukaansFrontend.git
   ```

2. Install dependencies
   ```
   cd localmarket
   npm install
   ```

3. Start the Metro server
   ```
   npx react-native start
   ```

4. Run the application
   ```
   npx react-native run-android
   # or
   npx react-native run-ios
   ```

## Project Structure

- **`/src/components`**: Reusable UI components
- **`/src/context`**: Context providers for global state
- **`/src/navigation`**: Navigation configuration
- **`/src/screens`**: Application screens
- **`/src/services`**: API services
- **`/assets`**: Static assets like images

## Next Steps

- Implement order history and tracking
- Add address management
- Integrate payment gateways
- Implement product search and filtering
- Add push notifications for order updates

## Original React Native Documentation

If you're looking for the original React Native setup instructions, see below:

### Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

#### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
