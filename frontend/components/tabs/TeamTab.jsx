import { useState, useRef } from 'react';
import { Users, UserPlus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../UserAvatar';
import './Tabs.css';

function TeamTab({ project, isAdmin }) {
  const { user } = useAuth();
  const [confirmingRemoval, setConfirmingRemoval] = useState(null);
  const teamListRef = useRef(null);

  // Use actual project team members instead of hardcoded data
  const teamMembers = project?.teamMembers || [];

  const handleRemoveMember = (memberId) => {
    if (!isAdmin) return;
    
    if (confirmingRemoval === memberId) {
      // Actually remove the member
      console.log('Removing member:', memberId);
      setConfirmingRemoval(null);
    } else {
      // Ask for confirmation
      setConfirmingRemoval(memberId);
      // Auto-cancel after 3 seconds
      setTimeout(() => {
        setConfirmingRemoval(null);
      }, 3000);
    }
  };

  const handleInviteMembers = () => {
    if (!isAdmin) return;
    // Invite members logic here
    console.log('Opening invite members modal');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'OWNER':
      case 'Founder':
        return '#4f46e5'; // Indigo
      case 'ADMIN':
        return '#2563eb'; // Blue
      case 'MEMBER':
        return '#6b7280'; // Gray
      default:
        return '#059669'; // Green for other positions
    }
  };

  const getDisplayRole = (role) => {
    // Map role to display name
    switch (role) {
      case 'OWNER':
      case 'Founder':
        return 'Founder';
      case 'ADMIN':
        return 'Admin';
      case 'MEMBER':
        return 'Member';
      default:
        return role; // Return the position name as is
    }
  };

  return (
    <div className="team-section">
      {isAdmin && (
        <div className="team-actions">
          <button className="invite-btn" onClick={handleInviteMembers}>
            <UserPlus size={20} />
            Invite Members
          </button>
        </div>
      )}

      <div ref={teamListRef} className="team-list scrollable">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <div key={member.id} className="member-item">
              <UserAvatar 
                user={member} 
                size="small" 
                name={member.name}
                color={member.avatar ? undefined : member.applicantColor}
              />
              <div className="member-info">
                <h4>{member.name}</h4>
                <p>{member.email || member.role}</p>
                {/* <p>{member.email}</p> */}
              </div>
              <div 
                className="member-role"
                style={{
                  backgroundColor: getRoleColor(member.role),
                  opacity: member.role === 'MEMBER' ? 0.8 : 1
                }}
              >
                {getDisplayRole(member.role)}
              </div>
              {isAdmin && member.role !== 'OWNER' && member.role !== 'Founder' && (
                <button 
                  className={`remove-member-btn ${confirmingRemoval === member.id ? 'confirming' : ''}`}
                  onClick={() => handleRemoveMember(member.id)}
                  aria-label={confirmingRemoval === member.id ? "Confirm removal" : "Remove member"}
                >
                  <X size={18} />
                  {confirmingRemoval === member.id && <span className="confirm-text">Confirm</span>}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="empty-team">
            <Users size={48} />
            <h3>No Team Members Yet</h3>
            <p>Start building your team by inviting members or accepting applications.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamTab; 