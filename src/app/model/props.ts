export interface PostOptionsProps {
    postUserId: number;     
    currentId: number;     
    onEdit: () => void; 
    onDelete: () => void;      
    onReport: () => void;      
  }

  export interface PostListProps{
    restaurantId: number;
  }