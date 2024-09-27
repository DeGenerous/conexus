export interface VolumeControl {
	muted: boolean;
	volume: number;
	restart: boolean;
};

export interface StepData {
	step: number;
	story: string;
	end: boolean;
	summary: string;
	trait: string;
	options: string[];
	image?: string;
	tts?: Blob;
};