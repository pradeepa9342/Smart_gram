# 🚀 SMART-GRAM Execution Guide

Welcome to the **SMART-GRAM: Smart Village Digital Management System**. Follow these steps to correctly launch and demonstrate all synchronized modules during your hackathon demo.

---

## 1. ⚙️ Prerequisites
Ensure you have **Node.js** (v18.x or later) installed on your system.

## 2. ⚡ Launching the Project
Open your terminal in the project root directory and run:

```bash
# First, install dependencies (if not already installed)
npm install

# Then, start the development server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 🎭 3. Role-Based Demo Experience
The system is designed for **two separate roles** (Admin and Villager). For the best demo, open two separate browser windows (or use Incognito mode for one).

### **🔐 Option A: Admin Portal (Municipal Officer)**
*   **Demo Credentials**: 
    *   **Email**: `admin@smartgram.gov`
    *   **Password**: `admin123`
*   **Key Tasks**: Add/Edit Crops, Reply to Complaints, Adjust Water Tank Levels, Manage Doctor Availability, Launch Government Schemes.

### **👤 Option B: User Portal (Farmer/Villager)**
*   **Demo Credentials**: 
    *   **Email**: `user@smartgram.gov`
    *   **Password**: `user123`
*   **Key Tasks**: Track Water Levels, View Market Prices, Submit a New Complaint, Search and Apply for Schemes.

---

## 🔄 4. Synchronized Data Showcase
Smart-Gram uses a shared local state to simulate a high-performance backend. Show off these features:

- **LIVE WATER ALERTS**: Slide a water tank below 20% in the Admin Water panel. The User Water dashboard will instantly turn **RED** and show an alert.
- **INSTANT SCHEMES**: Add a new "Village Grant" scheme in the Admin Schemes panel. The Villager side will show the new scheme **immediately** without a page refresh.
- **MARKET SYNC**: Update the Paddy price in Agriculture. The Farmer's dashboard will show the new price **real-time**.

## 🛠️ 5. Troubleshooting (Windows Users)
If you see an error: *"Scripts are disabled on this system"* when running `npm`, use this command:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; npm run dev
```

---

**Good luck with your demo! Smart-Gram is officially "Hackathon Ready"!** 🏆

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass; npm run dev