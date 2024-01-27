# -*- coding: utf-8 -*-
import re
import sys

SLUG_PATTERN = r'^[_a-zA-Z][_a-zA-Z0-9-]+$'
EMAIL_ID_PATTERN = r'^[_a-zA-Z][_a-zA-Z0-9-]+@[_a-zA-Z0-9][_.a-zA-Z0-9-]+$'
UUID_PATTERN = r'^[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$'

slug = '{{ cookiecutter.project_slug }}'
extension_id = '{{ cookiecutter.extension_id }}'

if not re.match(SLUG_PATTERN, slug):
    print('ERROR: "{}" is not a valid slug name'.format(slug))
    sys.exit(1)

if not (re.match(EMAIL_ID_PATTERN, extension_id) or re.match(UUID_PATTERN, extension_id)):
    print('ERROR: "{}" is not a valid extension ID'.format(extension_id))
    sys.exit(1)
