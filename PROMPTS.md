# Painted Motion art sources

Generated with the built-in image generator, using the original five-fighter roster as the style/identity reference and Ember's sheet as a layout reference for the other fighters. No external API key was used.

Shared prompt specification: production transparent 8-column × 8-row animation sheet, one fighter, complete detailed painted full-body figures, consistent right-facing orthographic camera, natural adult proportions, engraved metal and detailed fabric, consistent identity/scale, no weapons/effects/text/borders, transparent margins. Row order: eight idle poses; eight run poses; eight jump/land poses; eight dodge somersault poses; eight side-heavy poses; eight up-heavy poses; eight down-heavy poses; eight jab/cross/kick light-chain poses. Keep the original illustration quality; no 3D toys, simplified vectors, disassembled parts or chibi proportions.

Identity additions:

- Ember: first roster fighter; young man, dark tousled hair, red scarf/tunic, ornate dark iron armor.
- Lyra: second; athletic woman, white ponytail, teal scarf/cape, ornate blue leather and silver armor.
- Bastion: third; broad bearded man, intricate silver/gold plate armor and cream tabard.
- Nyx (generation failed at usage limit): fourth; purple-hooded masked assassin with dark layered leather armor and detailed buckles.
- Marin: fifth; young martial artist, black hair, sleeveless ornate green/teal robes, cream sash and wrist bracers.

`ember.png`, `lyra.png`, `bastion.png`, `marin.png` are the generated source sheets. `painted-parts.png` preserves the previous generated five-fighter component atlas. `nyx.png` was assembled offline from Nyx's painted components using `scripts/bake-painted-nyx.cjs`; `nyx-grips.json` records its hand anchors. All five source sheets are converted and interpolated by `scripts/build-painted-sprites.cjs`. FFmpeg's motion compensation adds twenty frames between source poses; this is animation processing of supplied art, not additional AI-painted images.
