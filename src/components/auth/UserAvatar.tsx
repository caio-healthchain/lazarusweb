import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  name?: string | null;
  avatar?: string | null;
  className?: string;
}

const getUserInitials = (name?: string | null) => {
  if (!name) return 'U';

  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const UserAvatar = ({ name, avatar, className = 'h-8 w-8' }: UserAvatarProps) => (
  <Avatar className={className}>
    <AvatarImage src={avatar || undefined} alt={name || 'Usuário'} />
    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs">
      {getUserInitials(name)}
    </AvatarFallback>
  </Avatar>
);

export default UserAvatar;
