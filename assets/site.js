    (function () {
      var toggle = document.getElementById("navToggle");
      var nav = document.getElementById("siteNav");
      var mq = window.matchMedia("(max-width: 768px)");

      function ariaOpenLabel() {
        return "Open menu";
      }

      function ariaCloseLabel() {
        return "Close menu";
      }

      function closeNav() {
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", ariaOpenLabel());
      }

      function openNav() {
        nav.classList.add("is-open");
        document.body.classList.add("nav-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", ariaCloseLabel());
      }

      if (toggle && nav) {
        toggle.addEventListener("click", function () {
          if (nav.classList.contains("is-open")) closeNav();
          else openNav();
        });

        nav.querySelectorAll("a").forEach(function (link) {
          link.addEventListener("click", function () {
            if (mq.matches) closeNav();
          });
        });

        window.addEventListener("resize", function () {
          if (!mq.matches) closeNav();
        });
      }
    })();

    (function () {
      /*
        Web3Forms — deliveries go to the inbox used to create the key (use info@paragon-entertainment.jp).
        1) Open https://web3forms.com → Create Access Key → enter info@paragon-entertainment.jp
        2) Copy the key from the email and paste it into WEB3FORMS_ACCESS_KEY below (this value may be public on the client).
      */
      var WEB3FORMS_ACCESS_KEY = "d4ffd550-ddf8-4439-8185-7da76378fb4b";
      var WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
      var form = document.getElementById("contactForm");
      var stepForm = document.getElementById("contactStepForm");
      var stepConfirm = document.getElementById("contactStepConfirm");
      var stepThanks = document.getElementById("contactStepThanks");
      var confirmPanel = document.getElementById("confirmPanel");
      var btnToConfirm = document.getElementById("btnToConfirm");
      var btnConfirmBack = document.getElementById("btnConfirmBack");
      var btnConfirmSend = document.getElementById("btnConfirmSend");
      var formSendError = document.getElementById("formSendError");
      if (!form || !btnToConfirm) return;

      function lang() {
        return document.documentElement.getAttribute("data-lang") || "ja";
      }

      function labelKind(v) {
        if (v === "organization") return lang() === "ja" ? "法人・団体" : "Organization";
        if (v === "individual") return lang() === "ja" ? "個人" : "Individual";
        return v || "—";
      }

      function buildMessageBody(fd) {
        var inquiry = fd.get("inquiryType") || "";
        var kind = fd.get("applicantKind") || "";
        var company = (fd.get("companyName") || "").trim();
        var name = (fd.get("fullName") || "").trim();
        var email = (fd.get("email") || "").trim();
        var phone = (fd.get("phone") || "").trim();
        var purpose = (fd.get("purpose") || "").trim();
        if (lang() === "ja") {
          return (
            "【カテゴリ】\n" +
            inquiry +
            "\n\n【区分】\n" +
            labelKind(kind) +
            "\n\n【企業名・団体名】\n" +
            (company || "（なし）") +
            "\n\n【お名前】\n" +
            name +
            "\n\n【メール】\n" +
            email +
            "\n\n【電話】\n" +
            (phone || "（なし）") +
            "\n\n【メッセージ】\n" +
            purpose
          );
        }
        return (
          "Category:\n" +
          inquiry +
          "\n\nType:\n" +
          labelKind(kind) +
          "\n\nOrganization:\n" +
          (company || "—") +
          "\n\nName:\n" +
          name +
          "\n\nEmail:\n" +
          email +
          "\n\nPhone:\n" +
          (phone || "—") +
          "\n\nMessage:\n" +
          purpose
        );
      }

      function fillConfirm() {
        var fd = new FormData(form);
        var keysJa = [
          ["カテゴリ", fd.get("inquiryType") || "—"],
          ["区分", labelKind(fd.get("applicantKind"))],
          ["企業名・団体名", (fd.get("companyName") || "").trim() || "（なし）"],
          ["お名前", (fd.get("fullName") || "").trim()],
          ["メール", (fd.get("email") || "").trim()],
          ["電話", (fd.get("phone") || "").trim() || "（なし）"],
          ["メッセージ", (fd.get("purpose") || "").trim()],
        ];
        var keysEn = [
          ["Category", fd.get("inquiryType") || "—"],
          ["Type", labelKind(fd.get("applicantKind"))],
          ["Organization", (fd.get("companyName") || "").trim() || "—"],
          ["Name", (fd.get("fullName") || "").trim()],
          ["Email", (fd.get("email") || "").trim()],
          ["Phone", (fd.get("phone") || "").trim() || "—"],
          ["Message", (fd.get("purpose") || "").trim()],
        ];
        var rows = lang() === "ja" ? keysJa : keysEn;
        confirmPanel.innerHTML = "<dl>" +
          rows
            .map(function (row) {
              return "<dt>" + row[0] + "</dt><dd>" + escapeHtml(row[1]) + "</dd>";
            })
            .join("") +
          "</dl>";
      }

      function escapeHtml(s) {
        var d = document.createElement("div");
        d.textContent = s;
        return d.innerHTML;
      }

      btnToConfirm.addEventListener("click", function () {
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        fillConfirm();
        formSendError.hidden = true;
        stepForm.hidden = true;
        stepConfirm.hidden = false;
        confirmPanel.setAttribute("tabindex", "-1");
        confirmPanel.focus();
      });

      btnConfirmBack.addEventListener("click", function () {
        stepConfirm.hidden = true;
        stepForm.hidden = false;
      });

      btnConfirmSend.addEventListener("click", function () {
        formSendError.hidden = true;
        var fd = new FormData(form);
        var email = (fd.get("email") || "").trim();
        var name = (fd.get("fullName") || "").trim();
        var subjectLine =
          (lang() === "ja" ? "【Web】" : "[Web] ") + (fd.get("inquiryType") || "Contact");
        var bodyText = buildMessageBody(fd);

        if (!WEB3FORMS_ACCESS_KEY || !String(WEB3FORMS_ACCESS_KEY).trim()) {
          formSendError.textContent =
            lang() === "ja"
              ? "送信の準備ができていません。サイト管理者が Web3Forms のアクセスキーを設定するまでお待ちください。"
              : "This form is not ready to send yet. Please ask the site administrator to add the Web3Forms access key.";
          formSendError.hidden = false;
          return;
        }

        btnConfirmSend.disabled = true;
        fetch(WEB3FORMS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY.trim(),
            subject: subjectLine,
            name: name,
            email: email,
            message: bodyText,
            from_name: "Paragon site — " + name,
            replyto: email,
          }),
        })
          .then(function (r) {
            return r.json().then(function (data) {
              return { ok: r.ok, data: data };
            });
          })
          .then(function (res) {
            if (res.data && res.data.success === true) {
              stepConfirm.hidden = true;
              stepThanks.hidden = false;
              return;
            }
            throw new Error((res.data && res.data.message) || "send");
          })
          .catch(function () {
            formSendError.textContent =
              lang() === "ja"
                ? "送信に失敗しました。しばらくしてから再度お試しください。"
                : "Could not send. Please try again shortly.";
            formSendError.hidden = false;
          })
          .finally(function () {
            btnConfirmSend.disabled = false;
          });
      });

      window._paragonRefillConfirm = fillConfirm;
    })();

    (function () {
      var root = document.documentElement;
      var KEY = "paragon-lang";

      function setLang(code) {
        var c = code === "en" ? "en" : "ja";
        root.setAttribute("data-lang", c);
        root.setAttribute("lang", c);
        try {
          localStorage.setItem(KEY, c);
        } catch (e) {}
        var jaBtn = document.getElementById("langJa");
        var enBtn = document.getElementById("langEn");
        if (jaBtn && enBtn) {
          jaBtn.classList.toggle("is-active", c === "ja");
          enBtn.classList.toggle("is-active", c === "en");
        }
        var toggle = document.getElementById("navToggle");
        var siteNav = document.getElementById("siteNav");
        if (toggle && siteNav && !siteNav.classList.contains("is-open")) {
          toggle.setAttribute("aria-label", "Open menu");
        }
        document.querySelectorAll("[data-placeholder-ja]").forEach(function (el) {
          var ja = el.getAttribute("data-placeholder-ja");
          var en = el.getAttribute("data-placeholder-en");
          if (el.tagName === "OPTION" && el.disabled) {
            el.textContent = c === "en" ? en : ja;
          } else if (el.hasAttribute("placeholder")) {
            el.setAttribute("placeholder", c === "en" ? en : ja);
          }
        });
        var stepC = document.getElementById("contactStepConfirm");
        if (stepC && !stepC.hidden && typeof window._paragonRefillConfirm === "function") {
          window._paragonRefillConfirm();
        }

        // TOP hero: language toggle can temporarily hide in-progress animations.
        // Force re-start so hero text never gets stuck at opacity:0 after JP<->ENG.
        try {
          if (!root.classList.contains("no-motion")) {
            var hero = document.getElementById("top");
            if (hero) {
              var wrap = c === "en" ? hero.querySelector(".i18n-en") : hero.querySelector(".i18n-ja");
              if (wrap) {
                window.requestAnimationFrame(function () {
                  wrap.querySelectorAll(".hero-intro, .hero-chunk, .hero-word").forEach(function (el) {
                    el.style.animation = "none";
                    // Force reflow so the next animation start is applied.
                    void el.getBoundingClientRect();
                    el.style.animation = "";
                  });
                });
              }
            }
          }
        } catch (e) {}
      }

      var saved = "ja";
      try {
        saved = localStorage.getItem(KEY) || "ja";
      } catch (e) {}
      setLang(saved === "en" ? "en" : "ja");

      document.getElementById("langJa") &&
        document.getElementById("langJa").addEventListener("click", function () {
          setLang("ja");
        });
      document.getElementById("langEn") &&
        document.getElementById("langEn").addEventListener("click", function () {
          setLang("en");
        });
    })();

    (function () {
      var root = document.documentElement;
      var reduceMotion =
        root.classList.contains("no-motion") ||
        (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

      var ioOpts = { root: null, rootMargin: "0px 0px -11% 0px", threshold: 0.07 };

      function revealOnView(entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      }

      var revealIo = new IntersectionObserver(revealOnView, ioOpts);

      function bootReveal() {
        document.querySelectorAll(".reveal").forEach(function (el) {
          revealIo.observe(el);
        });
        document.querySelectorAll(".reveal-stagger").forEach(function (el) {
          revealIo.observe(el);
        });
        document.querySelectorAll(".section-rule").forEach(function (el) {
          revealIo.observe(el);
        });
      }

      var sectionIo = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("section--divider-in");
          obs.unobserve(entry.target);
        });
      }, {
        root: null,
        rootMargin: "0px 0px -9% 0px",
        threshold: 0.05,
      });

      if (reduceMotion) {
        document.querySelectorAll(".reveal, .reveal-stagger, .section-rule").forEach(function (el) {
          el.classList.add("is-visible");
        });
        document.querySelectorAll("main section:not(#top)").forEach(function (sec) {
          sec.classList.add("section--divider-in");
        });
      } else {
        bootReveal();
        document.querySelectorAll("main section:not(#top)").forEach(function (sec) {
          sectionIo.observe(sec);
        });
      }

      var hero = document.getElementById("top");
      var heroMedia = document.getElementById("heroMedia");
      var heroVideo = document.getElementById("heroVideo");
      var glow = document.getElementById("heroGlow");
      var scrollCue = document.getElementById("heroScrollCue");
      var spotlight = document.getElementById("heroSpotlight");
      var inner = hero ? hero.querySelector(".hero-inner") : null;

      if (hero) {
        document.body.classList.add("is-home");
      }

      // Hero video -> image transition (TOP only)
      if (hero && heroMedia && heroVideo) {
        var switched = false;
        function switchToAfter() {
          if (switched) return;
          switched = true;
          heroMedia.classList.add("is-after");
        }

        function retireMediaLayer() {
          heroMedia.style.opacity = "0";
          heroMedia.style.pointerEvents = "none";
        }

        // If autoplay fails (common on iOS), show the after image instead of hiding the whole layer.
        try {
          var p = heroVideo.play();
          if (p && typeof p.catch === "function") {
            p.catch(function () {
              switchToAfter();
            });
          }
        } catch (e) {}

        heroVideo.addEventListener("ended", switchToAfter);
        heroVideo.addEventListener("error", function () {
          switchToAfter();
        });

        // Fade slightly before the end so the after-image feels continuous.
        heroVideo.addEventListener("timeupdate", function () {
          if (switched) return;
          var d = heroVideo.duration;
          if (!d || !isFinite(d)) return;
          if (d - heroVideo.currentTime <= 0.45) {
            switchToAfter();
          }
        });

        // If the user scrolls past the hero, we can retire the layer.
        window.addEventListener(
          "scroll",
          function () {
            if (!switched && (window.scrollY || window.pageYOffset) < 10) return;
            if (document.body.classList.contains("is-hero-scrolled")) {
              retireMediaLayer();
            }
          },
          { passive: true }
        );

        // Allow tap to attempt playback on mobile. If it still fails, keep after image.
        heroMedia.addEventListener(
          "click",
          function () {
            if (switched) return;
            try {
              heroVideo.muted = true;
              heroVideo.playsInline = true;
              var pp = heroVideo.play();
              if (pp && typeof pp.catch === "function") {
                pp.catch(function () {
                  switchToAfter();
                });
              }
            } catch (e) {
              switchToAfter();
            }
          },
          { passive: true }
        );
      }

      function splitHeroTitle(h1) {
        var text = h1.textContent.trim();
        var tokens = text.split(/(\s+)/);
        h1.textContent = "";
        h1.classList.add("hero-title--split");
        var wi = 0;
        tokens.forEach(function (tok) {
          if (/^\s+$/.test(tok)) {
            h1.appendChild(document.createTextNode(tok));
            return;
          }
          if (!tok) return;
          var sp = document.createElement("span");
          sp.className = "hero-word";
          sp.style.setProperty("--w-i", String(wi));
          sp.textContent = tok;
          h1.appendChild(sp);
          wi += 1;
        });
      }

      function splitHeroBody(p) {
        var t = p.textContent.trim();
        var isJa = !!p.closest(".i18n-ja");
        var parts;
        if (isJa) {
          parts = t
            .split("。")
            .map(function (s) {
              return s.trim();
            })
            .filter(Boolean);
          if (parts.length < 2) return false;
          p.textContent = "";
          p.classList.add("hero-body--split");
          parts.forEach(function (part, i) {
            var s = document.createElement("span");
            s.className = "hero-chunk";
            s.style.setProperty("--c-i", String(i));
            s.textContent = part + "。";
            p.appendChild(s);
          });
          return true;
        }
        parts = t.split(". ");
        if (parts.length < 2) return false;
        p.textContent = "";
        p.classList.add("hero-body--split");
        parts.forEach(function (part, i) {
          var s = document.createElement("span");
          s.className = "hero-chunk";
          s.style.setProperty("--c-i", String(i));
          var isLast = i === parts.length - 1;
          var chunk = part.trim();
          if (!isLast) {
            chunk += ".";
          } else if (t.slice(-1) === "." && chunk.slice(-1) !== ".") {
            chunk += ".";
          }
          s.textContent = chunk + (isLast ? "" : " ");
          p.appendChild(s);
        });
        return true;
      }

      if (hero && !reduceMotion) {
        hero.querySelectorAll(".hero-title").forEach(splitHeroTitle);
        hero.querySelectorAll("p.hero-body.hero-intro").forEach(splitHeroBody);
        var wordCount = 0;
        hero.querySelectorAll(".hero-title--split").forEach(function (h1) {
          wordCount = Math.max(wordCount, h1.querySelectorAll(".hero-word").length);
        });
        window.setTimeout(function () {
          hero.querySelectorAll(".hero-title--split").forEach(function (h1) {
            h1.classList.add("is-hero-settled");
          });
        }, 1180 + wordCount * 85);
      }

      if (reduceMotion || !hero) return;

      var tiltX = 0;
      var tiltY = 0;
      function syncHeroInner() {
        if (!inner) return;
        var y = window.scrollY || window.pageYOffset;
        inner.style.transform =
          "translate3d(" + tiltX + "px, " + (tiltY + y * 0.048) + "px, 0)";
      }

      var scheduled = false;
      function applyHeroGlow() {
        scheduled = false;
        var y = window.scrollY || window.pageYOffset;
        var h = Math.max(hero.offsetHeight, 1);
        var t = Math.min(1, y / (h * 0.72));
        hero.style.setProperty("--hero-progress", String(t));
        document.body.classList.toggle("is-hero-scrolled", y > h * 0.1);
        if (glow) {
          glow.style.setProperty("--hero-parallax", y * 0.11 + "px");
          glow.style.setProperty("--hero-gx", 11 + t * 16 + "%");
          glow.style.setProperty("--hero-gy", -10 + t * 22 + "%");
          glow.style.setProperty("--hero-gx2", 90 - t * 8 + "%");
          glow.style.setProperty("--hero-gy2", 26 + t * 14 + "%");
          glow.style.setProperty("--hero-glow-opacity", String(Math.max(0.5, 1 - t * 0.42)));
        }
        if (scrollCue) {
          var cueOp = Math.max(0, 1 - y / (h * 0.2));
          scrollCue.style.setProperty("--hero-cue-opacity", String(cueOp));
        }
        syncHeroInner();
      }

      function onScroll() {
        if (!scheduled) {
          scheduled = true;
          requestAnimationFrame(applyHeroGlow);
        }
      }

      if (inner) {
        hero.addEventListener(
          "mousemove",
          function (e) {
            var r = hero.getBoundingClientRect();
            tiltX = ((e.clientX - r.left) / r.width - 0.5) * 18;
            tiltY = ((e.clientY - r.top) / r.height - 0.5) * 12;
            if (spotlight) {
              var sx = ((e.clientX - r.left) / r.width) * 100;
              var sy = ((e.clientY - r.top) / r.height) * 100;
              spotlight.style.setProperty("--sx", sx + "%");
              spotlight.style.setProperty("--sy", sy + "%");
            }
            syncHeroInner();
          },
          { passive: true }
        );
        hero.addEventListener("mouseleave", function () {
          tiltX = 0;
          tiltY = 0;
          if (spotlight) {
            spotlight.style.removeProperty("--sx");
            spotlight.style.removeProperty("--sy");
          }
          syncHeroInner();
        });
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      applyHeroGlow();
    })();
