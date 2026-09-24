export interface AiTagsDTO {
  material?: string;
  condition?: string;
  description?: string;
  source: "ai" | "user";
}

export interface ListingDTO {
  _id: string;
  ownerId: string;
  ownerName?: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  condition: string;
  photoUrl?: string;
  aiTags?: AiTagsDTO;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  status: string;
  createdAt: string;
}

export interface UserDTO {
  _id: string;
  name: string;
  email: string;
  role: string;
  location?: {
    address?: string;
    lat?: number;
    lng?: number;
  };
  contactInfo?: string;
}
