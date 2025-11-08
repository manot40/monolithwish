<script lang="ts">
	import type { RecruitHistory } from '$lib/types/common';

	import { getAsset, getRecruit } from '$lib/utils/assets-glob';

	let { type, rarity, id }: RecruitHistory = $props();
</script>

<div class="main" data-type={type}>
	<img class="bg bg_{rarity}" src={getAsset(`fx_ui_character_gacha_${rarity}`)} alt="" />
	<div class="card">
		<img class="card_border" src={getAsset(`db_gacha_${type}_${rarity}`)} alt="" />
		<img class="recruit" src={getRecruit(type, id)} alt="" />
		<img
			class="foreground"
			src={getAsset(type == 'disc' ? `zs_gacha_outfit` : `zs_gacha_character_${rarity}`)}
			alt=""
		/>
		<img class="rarity" src={getAsset(`rare_character_text_${rarity}`)} alt="" />
	</div>
</div>

<style>
	.main {
		display: grid;
		align-items: center;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
	}
	.card {
		scale: 1;
		display: grid;
		grid-area: 1 / 1;
		grid-template-columns: 1fr;
	}

	.rarity,
	.recruit,
	.foreground,
	.card_border {
		grid-area: 1 / 1;
	}
	.rarity {
		align-self: center;
		justify-self: center;
		margin-block-start: 265%;
	}
	.recruit,
	.foreground {
		align-self: self-end;
		justify-self: center;
	}

	.bg {
		grid-area: 1 / 1;
	}
	.bg_3 {
		scale: 1.2125;
	}
	.bg_4 {
		scale: 1.2125 1.33;
	}
	.bg_5 {
		scale: 1.2125 1.5;
	}

	.main[data-type='trekker'] .recruit {
		padding: calc((100% - (186 / 204 * 100%)) / 2);
	}
	.main[data-type='trekker'] .foreground {
		padding: calc((100% - (186 / 204 * 100%)) / 2);
	}
	.main[data-type='trekker'] .rarity {
		max-height: calc(47 / 711 * 104.5%);
	}

	.main[data-type='disc'] .recruit {
		padding: 4%;
		align-self: initial;
	}
	.main[data-type='disc'] .foreground {
		padding: 0 3% 4%;
	}
	.main[data-type='disc'] .rarity {
		max-height: calc(47 / 597 * 100%);
	}
</style>
