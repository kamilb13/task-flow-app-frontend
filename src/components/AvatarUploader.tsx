// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../store/store.ts";
// import axiosInstance from "../api/axiosInstance.ts";
//
// const AvatarUploader = () => {
//
//
//
//
//     // Pobieranie avatara przy załadowaniu komponentu
//     useEffect(() => {
//         const fetchAvatar = async () => {
//             console.log(user.token);
//             try {
//                 const response = await axiosInstance.get(`/get-avatar/${user.id}`, {
//                     headers: {
//                         Authorization: `Bearer ${user.token}`,
//                     },
//                     responseType: 'arraybuffer', // Specify binary response for images
//                 });
//
//                 // Convert image buffer to a base64 string
//                 const avatarBlob = new Blob([response.data], { type: 'image/jpeg' });
//                 const avatarUrl = URL.createObjectURL(avatarBlob);
//                 setAvatarUrl(avatarUrl); // Update avatarUrl with the blob URL
//             } catch (error) {
//                 console.log("Błąd pobierania avatara:", error);
//             }
//         };
//
//         fetchAvatar();
//     }, [user.id, user.token]); // Dependency array to fetch avatar only once when the user is loaded
//
//     return (
//         <div>
//             <img
//                 src={avatarUrl}
//                 alt="Avatar"
//                 style={{ width: "100px", height: "100px", cursor: "pointer", borderRadius: "50%" }}
//                 onClick={() => document.getElementById("avatarInput")?.click()}
//             />
//             <input
//                 id="avatarInput"
//                 type="file"
//                 accept="image/*"
//                 style={{ display: "none" }}
//                 onChange={handleFileChange}
//             />
//         </div>
//     );
// };
//
// export default AvatarUploader;
