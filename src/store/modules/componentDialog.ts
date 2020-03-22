declare global {
	interface DialogStatePayload {
		realSrc: string,
	}

	interface dialogState {
		on: boolean,
		payload: DialogStatePayload,
	}
}

const state: dialogState = {
	on: true,
	payload: {
		realSrc: ''
	}
};

const mutations = {
	dialogOn(state: dialogState, payload: DialogStatePayload) {
		state.on = true;
		state.payload = payload;
	},
	dialogOff(state: dialogState) {
		debugger;
		state.on = false;
	}
};

const actions = {};

const getters = {};

export default {
	state,
	mutations,
	actions,
	getters
};
