
# CoDraw | Collaborative Drawing App 🎨

[Live Demo 🚀](https://github.com/mubasirvc/my_portfolio) |

## Introduction
**CoDraw** is a real-time collaborative drawing platform designed for creativity and teamwork. Multiple users can simultaneously create and edit drawings on a shared canvas while communicating via chat and voice within their room. The app leverages cutting-edge technologies to deliver a seamless and engaging experience.

---

## Features
- **Real-time Collaboration**: Draw and interact on a shared canvas with multiple users in real-time.
- **Integrated Chat & Voice**: Communicate with others via text chat and voice within the same room.
- **Dynamic Drawing Tools**: Utilize a variety of drawing tools powered by the Canvas API for smooth and intuitive interactions.
- **Room-based Collaboration**: Create or join rooms to collaborate in isolated environments.
- **Responsive Design**: Fully responsive UI, ensuring a seamless experience across devices.
- **Advanced Drawing Tools**: Add features like shape tools, layers, and color palettes.
- **Drawing History:**: Implement undo/redo functionality for better control.

---

## Tech Stack
### Frontend:
- **Next.js**: For server-side rendering and optimized performance.
- **TypeScript**: Ensures type safety and maintainable code.
- **Redux**: Manages application state for consistent canvas synchronization across users.

### Backend:
- **Socket.IO**: Enables real-time, bidirectional communication between clients and the server.
- **Express.js**: Powers the backend server for efficient handling of API requests and socket events.

### Other Tools & Libraries:
- **Canvas API**: Powers dynamic and interactive drawing features.
- **Tailwind CSS**: Used for styling with a utility-first approach, ensuring quick and responsive design.
- **Vercel**: For seamless deployment and hosting.

---

## Installation and Setup

Follow these steps to run CoDraw locally:

### Prerequisites:
- [Node.js](https://nodejs.org/) (v16+)
- [Git](https://git-scm.com/)

### Steps:
1. **Clone the Repository**:
   ```bash
   git clone git@github.com:mubasirvc/CoDraw.git
   cd codraw
   
2. **Install Dependencies:**:
  npm install

3. **Start the Development Server**:
  npm run dev

4. **Visit the App:**:
  Open your browser and go to http://localhost:3000.

---

## Usage:

1.Create a Room: Start a new collaborative session by creating a room.
2.Invite Others: Share the room link with your friends or colleagues.
3.Collaborate: Draw together in real-time while communicating via chat or voice.
4.Save & Share: Export your creations and share them with the world!

---

## Project Structure

├── node_modules         # Installed dependencies
├── public               # Static assets like images, fonts, etc.
├── styles               # Global and scoped CSS/Tailwind styles
├── common               # Shared utilities and types
├── components           # Reusable UI components
├── constants            # Application-wide constants
├── hooks                # Custom hooks for shared logic
├── lib                  # Utility libraries and helper functions
├── redux                # Redux-related files
│   ├── store.ts         # Redux store configuration
│   └── options          # Slice and reducer definitions
├── modules              # Feature-based modules
│   ├── home             # Home module
│   │   └── components   # Home-specific components
│   └── room             # Room module
│       ├── helpers      # Utility functions for the Room module
│       ├── hooks        # Room-specific hooks
│       ├── modals       # Modals used within the Room module
│       └── components   # Room-specific components
├── pages                # Next.js pages (Routes)
│   ├── _app.tsx         # Custom App component
│   ├── _document.tsx    # Custom Document component
│   ├── api              # API routes
│   ├── index.tsx        # Landing page
│   └── [dynamic].tsx    # Dynamic routes
├── server               # Custom server folder
│   └── index.ts         # Express/HTTP server logic
├── tsconfig.json        # Main TypeScript configuration for the Next.js app
├── tsconfig.server.json # TypeScript configuration for the server folder
├── next.config.js       # Next.js configuration


---


## Key Learning & Challenges:

* Real-time Data Synchronization: Implemented real-time drawing and communication using Socket.IO, ensuring a smooth user experience.
* Type Safety: Leveraged TypeScript for robust type-checking, reducing runtime errors and improving maintainability.
* Scalability: Designed a modular and scalable codebase, following best practices to support future growth and additional features.
* Canvas API Integration: Utilized the Canvas API for advanced drawing functionalities, ensuring high performance and responsiveness.

---

## Future Enhancements:

* Enhanced Drawing Tools: Expand the toolkit with features like shape tools, layers, and customizable color palettes for more versatility.
* Drawing History: Improve control with a comprehensive undo/redo system.
* Session Persistence: Enable saving and loading of drawing sessions to continue work seamlessly.
* User Authentication: Implement secure user authentication for personalized experiences and better user management.

---

## Screenshots

![Screenshot 1](/screenshots/ss1.png)
*Creating a drawing: Click on the "Get Started" button.*

![Screenshot 2](/screenshots/ss2.png)
*Add your username. To join an existing room, enter the room ID and click "Join".*

![Screenshot 3](/screenshots/ss3.png)
*The canvas will open where you can start drawing.*

![Screenshot 4](/screenshots/ss4.png)
*Share the link with friends to draw together, chat, and talk.*

---

## Contributing
Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

---

## Contact  
**Mubasir VC**  
[Portfolio](https://github.com/mubasirvc/my_portfolio) | [LinkedIn](https://www.linkedin.com/in/mubasir-vc/)
