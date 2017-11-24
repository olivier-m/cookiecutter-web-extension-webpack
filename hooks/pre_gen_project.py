# -*- coding: utf-8 -*-
import re
import sys

SLUG_PATTERN = r'^[_a-zA-Z][_a-zA-Z0-9-]+$'
ID_PATTERN = r'^[_a-zA-Z][_a-zA-Z0-9-]+@[_a-zA-Z0-9][_.a-zA-Z0-9-]+$'

slug = '{{ cookiecutter.project_slug }}'
extension_id = '{{ cookiecutter.extension_id }}'

if not re.match(SLUG_PATTERN, slug):
    print('ERROR: "{}" is not a valid slug name'.format(slug))
    sys.exit(1)

if not re.match(ID_PATTERN, extension_id):
    print('ERROR: "{}" is not a valid extension ID'.format(extension_id))
    sys.exit(1)
