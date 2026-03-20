export interface PartyBrand {
	toneId: string;
	letter: string;
	name: string;
	aliases?: string[];
}

const PARTY_BRANDS: PartyBrand[] = [
	{ toneId: 'a', letter: 'A', name: 'Socialdemokratiet' },
	{ toneId: 'b', letter: 'B', name: 'Radikale Venstre' },
	{ toneId: 'c', letter: 'C', name: 'Konservative Folkeparti', aliases: ['Det Konservative Folkeparti'] },
	{ toneId: 'd', letter: 'D', name: 'Nye Borgerlige' },
	{ toneId: 'f', letter: 'F', name: 'Socialistisk Folkeparti' },
	{ toneId: 'h', letter: 'H', name: 'Borgernes Parti' },
	{ toneId: 'i', letter: 'I', name: 'Liberal Alliance' },
	{ toneId: 'k', letter: 'K', name: 'Kristendemokraterne' },
	{ toneId: 'm', letter: 'M', name: 'Moderaterne' },
	{ toneId: 'o', letter: 'O', name: 'Dansk Folkeparti' },
	{ toneId: 'q', letter: 'Q', name: 'Frie Grønne' },
	{ toneId: 's', letter: 'S', name: 'Slesvigsk Parti' },
	{ toneId: 'v', letter: 'V', name: 'Venstre' },
	{ toneId: 'ae', letter: 'Æ', name: 'Danmarksdemokraterne' },
	{ toneId: 'oe', letter: 'Ø', name: 'Enhedslisten', aliases: ['Enhedslisten de Rød-Grønne'] },
	{ toneId: 'aa', letter: 'Å', name: 'Alternativet' }
];

const fallbackBrand: PartyBrand = {
	toneId: 'unknown',
	letter: '?',
	name: 'Ukendt aktør'
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

export function getPartyToneId(partyName: string): string {
	return findPartyBrand(partyName).toneId;
}

export { PARTY_BRANDS };
