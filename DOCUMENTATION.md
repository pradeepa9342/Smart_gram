# 💎 SMART-GRAM: Smart Village Digital Management System

SMART-GRAM is a comprehensive, bilingual (English & Tamil) digital platform designed to bridge the digital divide in rural areas. It empowers villagers with real-time information and provides municipal officers with tools to manage village resources efficiently.

---

## 🌟 Vision
To transform traditional villages into **Smart Villages** by providing a centralized digital hub for agriculture, healthcare, water management, and government services.

## 🚀 Key Modules

### 🌾 1. Agriculture (e-Mandate)
*   **Live Market Prices**: Real-time tracking of crop prices (Paddy, Turmeric, Sugarcane, etc.).
*   **Farming Intelligence**: Seasonal crop suggestions and fertilizer requirements.
*   **Pest Control**: Modern solutions for common crop diseases.
*   **Bilingual Advice**: All technical farming data is available in both English and Tamil.

### 💧 2. Water Infrastructure Monitoring
*   **Live Tank Levels**: Real-time visualization of village water storage levels.
*   **Low-Level Alerts**: Automated visual indicators (turning red below 20%) to notify users of potential scarcity.
*   **Supply History**: Weekly consumption patterns and supply schedules.

### 🏥 3. Healthcare Services
*   **Doctor Availability**: Live status of primary health center doctors and specialists.
*   **Clinic Locator**: Directory of nearby medical facilities and pharmacies.
*   **Health Drives**: Notifications for vaccination camps, blood donation drives, and awareness programs.

### 📜 4. Government Schemes & Services
*   **Unified Database**: One-stop access to all central and state-sponsored schemes.
*   **Eligibility Checker**: Categorized list for farmers, students, women, and seniors.
*   **Application Guides**: Step-by-step instructions on how to apply for benefits.

### 📝 5. Citizen Grievance System (Complaints)
*   **Digital Submission**: Villagers can submit complaints directly via the portal.
*   **Live Tracking**: Real-time status updates (Pending, In Progress, Resolved).
*   **Admin Responses**: Direct feedback loop between authorities and citizens.

---

## 🎭 Role-Based Access Control

The system maintains a strict separation of concerns through its dual-portal architecture:

| Feature | Villager Portal | Admin Portal |
| :--- | :---: | :---: |
| View Data (Prices, Levels) | ✅ | ✅ |
| Submit Complaints | ✅ | ❌ |
| Update Market Prices | ❌ | ✅ |
| Adjust Water Levels | ❌ | ✅ |
| Manage Health Records | ❌ | ✅ |
| Reply to Complaints | ❌ | ✅ |

---

## 🛠️ Technical Architecture

### **Frontend & Framework**
*   **Next.js (App Router)**: Utilizing React 19 for high-performance, SEO-friendly rendering.
*   **TypeScript**: Ensuring type safety across the entire application.
*   **Tailwind CSS**: A custom design system leveraging modern aesthetics (glassmorphism, vibrant gradients, and micro-animations).

### **Backend & State**
*   **Supabase**: Cloud database for real-time synchronization of complaints and user data.
*   **Context API**: Centralized state management for Authentication (`AuthContext`) and Internationalization (`LanguageContext`).
*   **Local Storage Sync**: Fallback mechanism for offline resilience and demonstration stability.

### **Bilingual Engine**
The platform uses a custom `LanguageContext` that dynamically swaps UI text between English and Tamil without requiring page reloads, ensuring accessibility for all village demographics.

---

## 🎨 Visual Identity
The design prioritizes clarity and a "premium" feel:
*   **Emerald Colors**: Reflecting nature and prosperity for agriculture.
*   **Sky Blue Accents**: Representing water and clarity.
*   **Lucide Icons**: High-quality, consistent iconography for intuitive navigation.
*   **Mobile-First**: Fully responsive layouts optimized for smartphone users in rural areas.

---

## 📈 Future Roadmap
1.  **IoT Integration**: Connecting physical sensors in water tanks and soil for automated data entry.
2.  **AI Voice Assistant**: Enabling illiterate users to interact with the platform via voice commands.
3.  **Offline-Sync**: Better support for areas with intermittent internet connectivity.
4.  **Weather Analysis**: Predictive weather alerts integrated with the agriculture module.

---

**Developed for the Digital Village Hackathon 🏆**
