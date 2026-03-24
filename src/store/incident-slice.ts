"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { z } from "zod";
import {
	incidentSchema,
	type Incident,
} from "@/schemas/incident-schema";
import incidentsData from "@/data/incidents.json";
import { toast } from "sonner";

const PAGE_SIZE = 10;
const MAX_INCIDENTS = 200;

let simulatedDB: Incident[] = z
	.array(incidentSchema)
	.parse(incidentsData);

export const fetchIncidents = createAsyncThunk<
	{ data: Incident[]; hasMore: boolean; nextIndex: number },
	{ startIndex?: number }
>("incidents/fetchIncidents", async ({ startIndex = 0 }) => {
	await new Promise((res) => setTimeout(res, 300));

	const sliced = simulatedDB.slice(startIndex, startIndex + PAGE_SIZE);

	return {
		data: z.array(incidentSchema).parse(sliced),
		hasMore: startIndex + PAGE_SIZE < simulatedDB.length,
		nextIndex: startIndex + PAGE_SIZE,
	};
});

export const createIncident = createAsyncThunk<Incident, Incident>(
	"incidents/createIncident",
	async (newIncident) => {
		await new Promise((res) => setTimeout(res, 200));

		simulatedDB.unshift(newIncident);

		if (simulatedDB.length > MAX_INCIDENTS) {
			simulatedDB = simulatedDB.slice(0, MAX_INCIDENTS);
		}

		return newIncident;
	}
);

export const updateIncidentApi = createAsyncThunk<Incident, Incident>(
	"incidents/updateIncident",
	async (updatedIncident) => {
		await new Promise((res) => setTimeout(res, 200));

		const index = simulatedDB.findIndex(
			(i) => i.id === updatedIncident.id
		);

		if (index !== -1) simulatedDB[index] = updatedIncident;

		return updatedIncident;
	}
);

export const deleteIncidentApi = createAsyncThunk<string, string>(
	"incidents/deleteIncident",
	async (incidentId) => {
		await new Promise((res) => setTimeout(res, 200));

		simulatedDB = simulatedDB.filter((i) => i.id !== incidentId);

		return incidentId;
	}
);

interface IncidentsState {
	incidents: Incident[];
	loading: boolean;
	error: string | null;
	hasMore: boolean;
	nextIndex: number;
}

const initialState: IncidentsState = {
	incidents: [],
	loading: false,
	error: null,
	hasMore: true,
	nextIndex: 0,
};

const incidentsSlice = createSlice({
	name: "incidents",
	initialState,
	reducers: {
		resetIncidents: (state) => {
			state.incidents = [];
			state.nextIndex = 0;
			state.hasMore = true;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIncidents.pending, (state) => {
				if (state.loading) return;
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchIncidents.fulfilled, (state, action) => {
				state.loading = false;

				const { data, hasMore, nextIndex } = action.payload;

				if (state.nextIndex === 0) {
					state.incidents = data;
				} else {
					const existingIds = new Set(
						state.incidents.map((i) => i.id)
					);
					const filtered = data.filter((i) => !existingIds.has(i.id));
					state.incidents = [...state.incidents, ...filtered].slice(
						0,
						MAX_INCIDENTS
					);
				}

				state.hasMore = hasMore;
				state.nextIndex = nextIndex;
			})
			.addCase(fetchIncidents.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error.message || "Failed to fetch incidents";
				toast.error(state.error);
			});

		builder
			.addCase(createIncident.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createIncident.fulfilled, (state, action) => {
				state.loading = false;
				state.incidents = [
					action.payload,
					...state.incidents,
				].slice(0, MAX_INCIDENTS);
			})
			.addCase(createIncident.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error.message || "Failed to create incident";
				toast.error(state.error);
			});

		builder
			.addCase(updateIncidentApi.fulfilled, (state, action) => {
				const index = state.incidents.findIndex(
					(i) => i.id === action.payload.id
				);
				if (index !== -1) {
					state.incidents[index] = action.payload;
				}
			})
			.addCase(updateIncidentApi.rejected, (state, action) => {
				state.error =
					action.error.message || "Failed to update incident";
				toast.error(state.error);
			});

		builder
			.addCase(deleteIncidentApi.fulfilled, (state, action) => {
				state.incidents = state.incidents.filter(
					(i) => i.id !== action.payload
				);
			})
			.addCase(deleteIncidentApi.rejected, (state, action) => {
				state.error =
					action.error.message || "Failed to delete incident";
				toast.error(state.error);
			});
	},
});

export const incidentsReducer = incidentsSlice.reducer;
export const { resetIncidents } = incidentsSlice.actions;