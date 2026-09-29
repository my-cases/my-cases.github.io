"""Regenerate the extended static catalog in index.html."""

import re
from html import escape
from pathlib import Path

from catalog_extra import EXTRA

page = Path(__file__).parent / 'index.html'
html = page.read_text(encoding='utf-8')


def task_word(count):
    if count % 10 == 1 and count % 100 != 11:
        return 'задача'
    if count % 10 in (2, 3, 4) and count % 100 not in (12, 13, 14):
        return 'задачи'
    return 'задач'


def update_group(match):
    group = match.group()
    number = int(match.group(1))
    group = re.sub(r'\s*<tr data-extended>.*?</tr>', '', group, flags=re.S)
    audience = re.search(r'<span class="scenario-name">(.*?)</span>', group).group(1)
    pairs = [line.strip().split('|', 1) for line in EXTRA[number].strip().splitlines()]
    assert len(pairs) == 21, (number, len(pairs))
    assert all(len(pair) == 2 for pair in pairs), number
    rows = []
    for problem, solution in pairs:
        rows.append(
            f'                    <tr data-extended><td>{escape(problem)}</td><td>'
            f'<a href="#contact" data-scenario data-audience="{escape(audience, quote=True)}" '
            f'data-problem="{escape(problem, quote=True)}" '
            f'data-solution="{escape(solution, quote=True)}">{escape(solution)} '
            f'<span aria-hidden="true">↗</span></a></td></tr>'
        )
    group = group.replace('                  </tbody>', '\n'.join(rows) + '\n                  </tbody>')
    count = len(re.findall(r'<tr(?: data-extended)?>', group)) - 1  # exclude table header
    group = re.sub(r'<span class="scenario-count">.*?</span>',
                   f'<span class="scenario-count">{count} {task_word(count)}</span>', group, count=1)
    return group


pattern = re.compile(r'<details class="scenario-group" id="scenario-(\d+)">.*?</details>', re.S)
html, group_count = pattern.subn(update_group, html)
assert group_count == len(EXTRA) == 16, group_count
total = len(re.findall(r'data-scenario(?:\s|>)', html))
assert total >= 410, total
html = re.sub(r'Листайте: \d+ задачи', f'Листайте: {total} {task_word(total)}', html)
page.write_text(html, encoding='utf-8')
print(f'{group_count} groups, {total} solutions')
