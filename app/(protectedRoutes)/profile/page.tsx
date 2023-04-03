"use client";
import { useAuth } from "@/components/providers/AuthProvider";
import Loading from "@/components/Loading";
import { db } from "@/firebase";
import { Friend } from "@/types/friend.types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const Profile = () => {
  const [profileData, setProfileData] = useState<Friend | null>();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { userMetaData } = useAuth();
  useEffect(() => {
    if (userMetaData !== null) {
      const fetchProfileData = async () => {
        if (userMetaData === null) return;
        try {
          const docRef = doc(db, "users", userMetaData.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setProfileData(docSnap.data() as Friend);
          } else {
            throw new Error("Profile data not found...");
          }
        } catch (error) {
          throw new Error((error as Error).message);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchProfileData();
    }
  }, [userMetaData]);

  if (isLoadingData && userMetaData !== null) return <Loading />;

  return (
    <section className="flex items-center gap-6 justify-center mt-3 flex-col sm:flex-row">
      <figure className="self-start mx-auto sm:mx-0">
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profileData?.profilePictureUrl}
          alt="profile"
          className="w-44 h-44 object-cover rounded-[50%] cursor-pointer mx-auto"
        />
      </figure>
      <div>
        <h2 className="text-3xl font-bold">{`${profileData?.firstname} ${profileData?.lastname}`}</h2>
      </div>
    </section>
  );
};

export default Profile;
