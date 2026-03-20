export interface PartyBrand {
	letter: string;
	name: string;
	color: string;
	soft: string;
	text: string;
	aliases?: string[];
}

const PARTY_BRANDS: PartyBrand[] = [
	{ letter: 'A', name: 'Socialdemokratiet', color: '#C53A32', soft: '#FDE8E7', text: '#7A1D18' },
	{ letter: 'B', name: 'Radikale Venstre', color: '#7A40A8', soft: '#F2E9FB', text: '#4C2370' },
	{ letter: 'C', name: 'Konservative Folkeparti', color: '#0C7E78', soft: '#E3F7F5', text: '#07524F', aliases: ['Det Konservative Folkeparti'] },
	{ letter: 'D', name: 'Nye Borgerlige', color: '#2458D6', soft: '#E8EEFF', text: '#173886' },
	{ letter: 'F', name: 'Socialistisk Folkeparti', color: '#D94C5A', soft: '#FFECEF', text: '#8B2D36' },
	{ letter: 'H', name: 'Borgernes Parti', color: '#2A7A60', soft: '#E7F8F2', text: '#194B3A' },
	{ letter: 'I', name: 'Liberal Alliance', color: '#2FA0E0', soft: '#E9F7FF', text: '#1A648E' },
	{ letter: 'K', name: 'Kristendemokraterne', color: '#FF9A39', soft: '#FFF3E5', text: '#9A5A1A' },
	{ letter: 'M', name: 'Moderaterne', color: '#6A4D3B', soft: '#F6EEE8', text: '#3E2C20' },
	{ letter: 'O', name: 'Dansk Folkeparti', color: '#F3B127', soft: '#FFF7E0', text: '#8B6105' },
	{ letter: 'Q', name: 'Frie Grønne', color: '#49A04A', soft: '#EAF8EA', text: '#2D642E' },
	{ letter: 'S', name: 'Slesvigsk Parti', color: '#3A6FC5', soft: '#EAF0FF', text: '#23457A' },
	{ letter: 'V', name: 'Venstre', color: '#2C67BE', soft: '#E9F1FF', text: '#1C4278' },
	{ letter: 'Æ', name: 'Danmarksdemokraterne', color: '#F17D2C', soft: '#FFF0E6', text: '#934913' },
	{ letter: 'Ø', name: 'Enhedslisten', color: '#D43A32', soft: '#FDE8E7', text: '#7E1F1A', aliases: ['Enhedslisten de Rød-Grønne'] },
	{ letter: 'Å', name: 'Alternativet', color: '#58B947', soft: '#EDFBEA', text: '#2F6A25' }
];

const fallbackBrand: PartyBrand = {
	letter: '?',
	name: 'Ukendt aktør',
	color: '#4F5C77',
	soft: '#EDF1F7',
	text: '#34405A'
};

function normalize(value: string): string {
	return value.trim().toLowerCase();
}

export function findPartyBrand(partyName: string): PartyBrand {
	const normalized = normalize(partyName);
	const found = PARTY_BRANDS.find((party) => {
		if (normalize(party.name) === normalized) {
			return true;
		}
		return (party.aliases ?? []).some((alias) => normalize(alias) === normalized);
	});

	if (found) {
		return found;
	}

	if (partyName.trim().length > 0) {
		return {
			...fallbackBrand,
			letter: partyName.trim().charAt(0).toUpperCase(),
			name: partyName
		};
	}

	return fallbackBrand;
}

export { PARTY_BRANDS };
