<template>
  <div>
    <b-container
      class="position-sticky full-sticky-bar top-0 bg-white"
      style="z-index: 100;"
    >
      <b-row>
        <div class="mt-4 position-sticky top-0 d-none d-md-block w-100 border-bottom">
          <b-container class="container-xl">
            <div class="flex-column flex-md-row d-flex">
              <div class="flex-shrink-0 col-12 col-md-4 mb-4 mb-md-0">
                <div
                  class="user-profile-sticky-bar"
                  :style="{ opacity: scrollY / 127 > 1 ? 1: scrollY / 127 }"
                >
                  <div>
                    <span class="pr-2">
                      <img
                        class="rounded-1 avatar-user"
                        height="32"
                        width="32"
                        alt="@AccountID"
                        src="https://cdn.lihkg.com/assets/img/icon.png"
                      >
                    </span>
                    <span>
                      <strong>AccountID</strong>
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex-shrink-0 col-12 col-md-8 mb-4 mb-md-0">
                <b-nav
                  tabs
                  fill
                  align="right"
                  style="border-bottom: none;"
                >
                  <b-nav-item active>
                    總覽
                  </b-nav-item>
                  <b-nav-item>貢獻</b-nav-item>
                  <b-nav-item>成就</b-nav-item>
                  <b-nav-item disabled>
                    統計
                  </b-nav-item>
                </b-nav>
              </div>
            </div>
          </b-container>
        </div>
      </b-row>
    </b-container>
    <b-container class="container-xl">
      <b-row class="mt-4 mt-xl-5 my-0">
        <b-col
          cols="12"
          sm="12"
          md="4"
          lg="4"
          xl="3"
        >
          <b-card
            no-body
            class="px-3 pl-xl-0 rounded-0 border-none border-right h-100"
          >
            <b-row class="no-gutters">
              <b-col
                cols="4"
                sm="3"
                md="12"
                class="d-flex align-items-end"
              >
                <a>
                  <img
                    style="height:auto; min-width: 72px"
                    alt=""
                    width="260"
                    height="260"
                    class="avatar avatar-user width-full border bg-white"
                    src="https://cdn.lihkg.com/assets/img/icon.png"
                  >
                </a>
              </b-col>
              <b-col
                cols="auto"
                sm="9"
                md="12"
                class="d-flex align-items-end"
              >
                <h1 class="vcard-names pl-2 pl-md-0">
                  <span class="vcard-fullname d-block overflow-hidden">{{ getDisplayName }}</span>
                  <span class="vcard-username d-block">@AccountID</span>
                </h1>
              </b-col>
            </b-row>
            <b-row cols="1">
              <b-col class="pt-2">
                <b-button
                  variant="outline-secondary"
                  block
                >
                  編輯個人資訊
                </b-button>
              </b-col>
              <b-col class="pt-2">
                <span>
                  <b-link class="link-gray"><b-icon
                    icon="people"
                    aria-hidden="true"
                  /> 1 位跟隨者</b-link>
                  ，
                  <b-link class="link-gray"> 0 位跟隨中</b-link>
                </span>
              </b-col>
              <b-col>
                <ul class="vcard-details p-0 pt-2">
                  <li
                    class="vcard-detail hide-sm hide-md"
                    show_title="false"
                    aria-label="居住地：台灣"
                  >
                    <b-icon
                      icon="geo-alt"
                      aria-hidden="true"
                    />
                    <span> Taiwan</span>
                  </li><li
                    class="vcard-detail pt-2 hide-sm hide-md"
                    show_title="false"
                    aria-label="Email：username@domain.com"
                  >
                    <b-icon
                      icon="envelope"
                      aria-hidden="true"
                    />
                    <a
                      class="link-gray"
                      href="mailto:username@domain.com"
                      target="_blank"
                    > {{ getEmail }}</a>
                  </li>
                </ul>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
        <b-col>
          <h3>近期編輯</h3>
          <b-row
            class="pt-2"
            cols="1"
            cols-lg="2"
          >
            <b-col
              v-for="i in 20"
              :key="i"
              class="py-2 py-lg-3"
            >
              <b-card>
                <div class="d-flex justify-content-between mb-2">
                  <b-link class="d-flex">
                    新聞標題
                  </b-link>
                  <b-link class="d-flex">
                    1970-01-01
                  </b-link>
                </div>
                <b-card-text>新聞簡述</b-card-text>
                <div class="mb-2 mr-2 d-inline-block">
                  <b-icon
                    icon="people"
                    aria-hidden="true"
                  />
                  <span> 100</span>
                </div>
                <div class="mb-2 mr-2 d-inline-block">
                  <b-icon
                    icon="rss"
                    aria-hidden="true"
                  />
                  <span> 50</span>
                </div>
                <div class="mb-2 mr-2 d-inline-block">
                  <b-icon
                    icon="pencil-square"
                    aria-hidden="true"
                  />
                  <span> 50</span>
                </div>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="container-xl">
      <div class="flex-column flex-md-row d-flex">
        <div class="flex-shrink-0 col-12 col-md-3 mb-4 mb-md-0">
          <div class="flex-shrink-0 col-12 col-md-9 mb-4 mb-md-0">
            <b-nav
              tabs
              filled
              class="d-block d-md-none postition-sticky top-0"
              style="z-index: 3;"
            >
              <b-nav-item active>
                總覽
              </b-nav-item>
              <b-nav-item>貢獻</b-nav-item>
              <b-nav-item>成就</b-nav-item>
              <b-nav-item disabled>
                統計
              </b-nav-item>
            </b-nav>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    getDisplayName () {
      return this.$store.getters.displayName
    },
    getEmail () {
      return this.$store.state.user.email
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      this.scrollY = window.scrollY
    }
  }
}
</script>

<style lang="scss" scoped>
.position-sticky {
    position: sticky !important;
}

.top-0 {
    top: 0 !important;
}

.full-sticky-bar {
  max-width: 100%;
}

.container-xl {
    max-width: 1280px;
}

.user-profile-sticky-bar {
    z-index: 90;
    word-break: break-all;
    pointer-events: none;
    transition: .2s;
}

.avatar {
    display: inline-block;
    overflow: hidden;
    line-height: 1;
    vertical-align: middle;
    border-radius: 6px;
}

.avatar-user {
    border-radius: 50%!important;
}

.flex-items-center {
    align-items: center!important;
}

.width-full {
    width: 100%!important;
}

.vcard-names {
    line-height: 1;
}

.vcard-fullname {
    font-size: 36px;
    line-height: 1.25;
}

.vcard-username {
    font-size: 24px;
    font-style: normal;
    font-weight: 300;
    line-height: 24px;
    color: #666;
}

a {
  text-decoration: none !important;
}

.link-gray {
  color: #666;

  &:hover {
    color: #0056b3 !important;
  }
}

.vcard-details {
    color: #666;
    list-style: none;
}

.float-left {
    float: left!important;
}

.border-none {
  border: none;
}
</style>
