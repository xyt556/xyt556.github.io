(function () {
  var base = window.CONTENT_BASE || '';

  function get(el) {
    return document.querySelector(el);
  }

  function all(el) {
    return document.querySelectorAll(el);
  }

  function setText(el, text) {
    if (!el) return;
    el.textContent = text;
  }

  function setHtml(el, html) {
    if (!el) return;
    el.innerHTML = html;
  }

  function setContent(el, value) {
    var key = el.getAttribute('data-content');
    if (key && value != null && value[key] !== undefined) {
      setText(el, value[key]);
    }
  }

  function setContentHtml(el, value) {
    var key = el.getAttribute('data-content-html');
    if (key && value != null && value[key] !== undefined) {
      setHtml(el, value[key]);
    }
  }

  function renderSoftware(list) {
    var container = document.getElementById('software-list');
    if (!container) return;
    if (!Array.isArray(list) || list.length === 0) {
      container.innerHTML = '<p class="loading">暂无软件条目，请在后台添加。</p>';
      return;
    }
    container.innerHTML = list.map(function (item) {
      var primary = item.downloadUrl && item.downloadLabel
        ? '<a href="' + escapeHtml(item.downloadUrl) + '" class="btn-primary" target="_blank" rel="noopener">' + escapeHtml(item.downloadLabel) + '</a>'
        : '';
      var extra = item.extraUrl && item.extraLabel
        ? '<a href="' + escapeHtml(item.extraUrl) + '" class="btn-secondary" target="_blank" rel="noopener">' + escapeHtml(item.extraLabel) + '</a>'
        : '';
      return (
        '<article class="software-card">' +
          '<h3>' + escapeHtml(item.name) + '</h3>' +
          (item.version ? '<div class="version">v' + escapeHtml(item.version) + '</div>' : '') +
          (item.description ? '<p>' + escapeHtml(item.description) + '</p>' : '') +
          '<div class="links">' + primary + extra + '</div>' +
        '</article>'
      );
    }).join('');
  }

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function applySiteContent(data) {
    all('[data-content]').forEach(function (el) {
      setContent(el, data);
    });
    all('[data-content-html]').forEach(function (el) {
      setContentHtml(el, data);
    });
    if (data.siteTitle) {
      var title = document.querySelector('title');
      if (title) title.textContent = data.siteTitle;
    }
  }

  Promise.all([
    fetch(base + 'content/site.json').then(function (r) { return r.json(); }),
    fetch(base + 'content/software.json').then(function (r) { return r.json(); })
  ]).then(function (results) {
    applySiteContent(results[0]);
    var list = results[1] && results[1].items ? results[1].items : [];
    renderSoftware(list);
  }).catch(function (err) {
    console.warn('加载内容失败，使用页面默认文案', err);
    var listEl = document.getElementById('software-list');
    if (listEl) listEl.innerHTML = '<p class="loading">内容加载失败，请检查 content/site.json 与 content/software.json 是否存在。</p>';
  });
})();
