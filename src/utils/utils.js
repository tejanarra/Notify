export const getUserInitials = (email) => {
    if (!email) return "?";
    const parts = email.split('@')[0].split('.');
    return parts.length >= 2 
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : email.substring(0, 2).toUpperCase();
  };