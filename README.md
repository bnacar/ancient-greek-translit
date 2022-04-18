This is my best attempt at reverse-engineering the Perseus
(www.perseus.tufts.edu/hopper/search/) Greek text input. The intended
use case would be an Ancient Greek online resource where the text is
stored as ASCII and rendered into Unicode or HTML codes for display,
which should make programmatic manipulation of diacritics simpler.

```
import AncientGreekConverter from './ancient-greek-translit.js';

const unicodeAG = new AncientGreekConverter(false);
const htmlAG = new AncientGreekConverter(true);

const firstLineOfTheIliad = 'mh=nin a)/eide qea\ *phlhi+a/dew *)axilh=os/'
const unicodeString = unicodeAG.convert(firstLineOfTheIliad);
const htmlString = htmlAG.convert(firstLineOfTheIliad);
```

A demo may be found at https://stuff.bennacar.com/greek/translit/.
