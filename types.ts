
export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface Release {
  id: string;
  title: string;
  tracks: Array<{
    name: string;
    startTime: string;
    endTime: string;
  }>;
}
