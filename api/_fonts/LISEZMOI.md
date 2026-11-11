# Polices de la carte cadeau PDF

Versions statiques (TTF) des polices du site, téléchargées depuis Google Fonts :
le PDF ne peut pas embarquer les fichiers variables `.woff2` de Fontsource.
Toutes sous licence SIL Open Font License 1.1.

| Fichier | Police |
|---|---|
| `anton.ttf` | Anton 400 |
| `nunito-700.ttf`, `nunito-800.ttf` | Nunito 700 et 800 |
| `caveat-600.ttf` | Caveat 600, **réduite** |

Caveat est réduite avec fontTools : alphabet latin seulement, sans tables de
mise en page (GSUB/GPOS) ni hinting. Ses alternances de lettres faussent les
largeurs que mesure pdf-lib, et son sous-ensemble à la volée perd des
glyphes : on l'embarque donc entière, d'où la réduction préalable.

```bash
pyftsubset Caveat-SemiBold.ttf \
  --unicodes='U+0020-007E,U+00A0-024F,U+2010-2027,U+2030-205E,U+20AC,U+2122,U+1E00-1EFF' \
  --layout-features='' --no-hinting --output-file=caveat-600.ttf
```
