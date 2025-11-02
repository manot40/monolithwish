export type UserAction<Ev extends Event, Ele extends HTMLElement> = Ev & {
	currentTarget: EventTarget & Ele;
};
