// Tiny command prompt for the link page.
// Anything the visitor types is only ever written with textContent.

(function(){
    const MAX_LEN = 64;
    const MAX_LINES = 60;

    const form = document.getElementById('cmd');
    const input = document.getElementById('cmd-input');
    const output = document.getElementById('output');
    const secrets = document.getElementById('secrets');
    if (!form || !input || !output) return;

    const PROMPT_USER = 'michael@capsule-corp';

    // "summon shenron" is left out of help on purpose.
    const COMMANDS = {
        help: () => [
            'available commands:',
            '  help     show this list',
            '  whoami   who is this guy',
            '  ls       list the links',
            '  clear    clear the screen',
        ],
        whoami: () => [
            'Michael De La Riva',
            'senior ecommerce merchandiser · orange county, ca',
        ],
        ls: () => {
            const names = Array.from(document.querySelectorAll('.links .label'), el => el.textContent);
            if (secrets && !secrets.hidden) names.push('.star', '.dragon');
            return [names.join('  ')];
        },
        clear: () => {
            output.replaceChildren();
            return null;
        },
        'summon shenron': () => {
            if (!secrets) return [];
            const already = !secrets.hidden;
            secrets.hidden = false;
            return [{
                text: already
                    ? 'Shenron is already here. Your wish was granted.'
                    : 'The sky goes dark... Shenron appears. ./.secrets unlocked.',
                cls: 'ok',
            }];
        },
    };

    function line(text, cls){
        const p = document.createElement('p');
        if (cls) p.className = cls;
        p.textContent = text;
        output.appendChild(p);
    }

    function echo(raw){
        const p = document.createElement('p');
        const user = document.createElement('span');
        user.className = 'user';
        user.textContent = PROMPT_USER;
        const path = document.createElement('span');
        path.className = 'path';
        path.textContent = ':~$';
        p.className = 'prompt';
        p.append(user, path, ' ' + raw);
        output.appendChild(p);
    }

    function trim(){
        while (output.childElementCount > MAX_LINES) output.firstElementChild.remove();
    }

    function run(raw){
        const typed = raw.slice(0, MAX_LEN);
        const key = typed.trim().toLowerCase().replace(/\s+/g, ' ');
        if (!key) return;

        echo(typed);
        const cmd = Object.prototype.hasOwnProperty.call(COMMANDS, key) ? COMMANDS[key] : null;

        if (!cmd){
            line('command not found: ' + typed.trim() + '. Type help.', 'error');
        } else {
            const result = cmd();
            if (result) result.forEach(r => typeof r === 'string' ? line(r, 'reply') : line(r.text, r.cls));
        }
        trim();
        form.scrollIntoView({ block: 'nearest' });
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        run(input.value);
        input.value = '';
    });

    form.hidden = false;
})();
