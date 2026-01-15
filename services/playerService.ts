
// Fix: Using namespace import for firestore to resolve member resolution issues
import * as firestore from "firebase/firestore";
import { db } from "./firebase";

export const syncGlobalState = async () => {
  const playersRef = firestore.collection(db, "players");
  const snapshot = await firestore.getDocs(playersRef);
  return snapshot.size;
};

// وظيفة حفظ سجل الحضور اليومي
export const saveAttendanceRecord = async (date: string, team: string, records: any) => {
  const attendanceRef = firestore.collection(db, "attendance_logs");
  const docRef = await firestore.addDoc(attendanceRef, {
    date,
    team,
    records,
    createdAt: firestore.Timestamp.now(),
    approvedBy: "Admin/Coach"
  });
  return docRef.id;
};

export const approvePlayerRequest = async (playerId: string) => {
  const playerDoc = firestore.doc(db, "players", playerId);
  await firestore.updateDoc(playerDoc, { 
    status: 'active',
    attendanceRate: 100,
    lastUpdated: firestore.Timestamp.now()
  });
};

export const markAsPaid = async (playerId: string) => {
  const playerDoc = firestore.doc(db, "players", playerId);
  await firestore.updateDoc(playerDoc, { 
    paymentStatus: 'paid',
    lastUpdated: firestore.Timestamp.now()
  });
};

export const updatePlayerTeam = async (playerId: string, teamName: string) => {
  const playerDoc = firestore.doc(db, "players", playerId);
  await firestore.updateDoc(playerDoc, { 
    team: teamName,
    lastUpdated: firestore.Timestamp.now()
  });
};

export const registerNewPlayer = async (playerData: any, idPhoto?: File, personalPhoto?: File, initialStatus: 'active' | 'pending' = 'pending', initialPayment: 'paid' | 'unpaid' = 'unpaid') => {
  try {
    // نستخدم روابط افتراضية بما أن خدمة Storage غير مفعلة
    const idPhotoUrl = idPhoto ? "https://placehold.co/600x400?text=ID+Uploaded" : "";
    const personalPhotoUrl = personalPhoto ? "https://placehold.co/400x400?text=Avatar" : "";

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const suggestedUsername = (playerData.fullName || "user").split(' ')[0] + randomSuffix;

    const docRef = await firestore.addDoc(firestore.collection(db, "players"), {
      ...playerData,
      idPhotoUrl,
      personalPhotoUrl,
      createdAt: firestore.Timestamp.now(),
      attendanceRate: initialStatus === 'active' ? 100 : 0, 
      status: initialStatus,
      paymentStatus: initialPayment,
      username: suggestedUsername,
      password: "" 
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding player: ", error);
    throw error;
  }
};

export const updatePlayerProfile = async (playerId: string, updates: any) => {
  const playerDoc = firestore.doc(db, "players", playerId);
  await firestore.updateDoc(playerDoc, { 
    ...updates,
    lastUpdated: firestore.Timestamp.now()
  });
};

export const deletePlayer = async (playerId: string) => {
  const playerDoc = firestore.doc(db, "players", playerId);
  await firestore.deleteDoc(playerDoc);
};

export const subscribeToPlayers = (callback: (players: any[]) => void) => {
  const q = firestore.query(firestore.collection(db, "players"));
  return firestore.onSnapshot(q, (snapshot) => {
    const players = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(players);
  });
};

export const sendApprovalNotification = async (phone: string, playerName: string) => {
  console.log(`Notification for ${playerName} sent to ${phone}`);
  return new Promise((resolve) => setTimeout(resolve, 1000));
};
