import { useGetAdminProfileQuery } from "@/store/api/authApi";
import React from "react";

interface ProfileProps {
  adminId: string;
}

const ProfileComponent: React.FC<ProfileProps> = ({ adminId }) => {
  const {
    data: profileResponse,
    isLoading,
    error,
    refetch,
    isError,
  } = useGetAdminProfileQuery(adminId);

  if (isLoading) return <div>Loading profile...</div>;

  if (isError) {
    return (
      <div>
        <div style={{ color: "red" }}>
          Error loading profile:{" "}
          {(error as any)?.data?.message || "Unknown error"}
        </div>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  const profile = profileResponse?.data;

  return (
    <div>
      <h2>Admin Profile</h2>
      {profile ? (
        <div>
          <p>
            <strong>Name:</strong> {profile.firstname} {profile.lastname}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Phone:</strong> {profile.phoneno}
          </p>
          <p>
            <strong>Admin ID:</strong> {profile.adminid}
          </p>
        </div>
      ) : (
        <div>No profile data available</div>
      )}
      <button onClick={refetch} disabled={isLoading}>
        Refresh Profile
      </button>
    </div>
  );
};

export default ProfileComponent;
