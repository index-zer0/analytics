package main

import (
	// Standard library packages
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"strconv"
	"time"

	// Third party packages
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
	"github.com/mssola/user_agent"
	"golang.org/x/crypto/argon2"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB
var salt []byte = []byte("randomdwadawdawdwad3")
var saltUpdateAt time.Time

type Page struct {
	gorm.Model
	Url       string `gorm:"index:,unique"`
	CreatedAt time.Time
}

type SessionPages struct {
	gorm.Model
	SessionId string
	PageUrl   string
	CreatedAt time.Time
}

type Entry struct {
	gorm.Model
	SessionId string
	PageUrl   string
	CreatedAt time.Time
}

type Exit struct {
	gorm.Model
	SessionId string
	PageUrl   string
	CreatedAt time.Time
}

type Session struct {
	// duration?
	gorm.Model
	Id             string `gorm:"index:,unique"`
	Size           int
	Browser        string
	BrowserVersion string
	Os             string
	City           string
	Region         string
	Country        string
	Referrer       string
	EntryPage      Entry `gorm:"foreignKey:SessionId"`
	ExitPage       Exit  `gorm:"foreignKey:SessionId"`
	UpdatedAt      time.Time
	CreatedAt      time.Time
}

type TopCount struct {
	Name  string
	Count int
}

type WindowSizes struct {
	Desktop uint32 `json:"desktop"`
	Laptop  uint32 `json:"laptop"`
	Tablet  uint32 `json:"tablet"`
	Mobile  uint32 `json:"mobile"`
}

type Payload struct {
	UniqueVisitors uint32  `json:"unique_visitors"`
	PageViews      uint32  `json:"page_views"`
	BounceRate     float32 `json:"bounce_rate"`

	Sizes         WindowSizes    `json:"sizes"`
	TopBrowsers   map[string]int `json:"top_browsers"`
	TopOss        map[string]int `json:"top_oss"`
	TopCities     map[string]int `json:"top_cities"`
	TopRegions    map[string]int `json:"top_regions"`
	TopCountries  map[string]int `json:"top_countries"`
	TopPages      map[string]int `json:"top_pages"`
	TopEntryPages map[string]int `json:"entry_pages"`
	TopExitPages  map[string]int `json:"exit_pages"`
	TopSources    map[string]int `json:"top_sources"`
}

func generateSalt(n uint32) []byte {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}

	return b
}

func generateSessionId(hostname string, ip string, ua string) string {
	/*if saltUpdateAt.Day() != time.Now().Day() {
		salt = generateSalt(16)
		saltUpdateAt = time.Now()
	}*/

	hash := argon2.IDKey([]byte(hostname+ip+ua), salt, 3, 1024*64, 2, 32)
	return base64.RawStdEncoding.EncodeToString(hash)
}

func analyticsScript(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	contents, _ := ioutil.ReadFile("index.js")
	fmt.Fprintf(w, string(contents))
}

func AllTime() string {
	var payload Payload

	var unique_visitors int64
	//db.Model(&User{}).Where("name = ?", "jinzhu").Count(&count)
	db.Model(&Session{}).Count(&unique_visitors)
	payload.UniqueVisitors = uint32(unique_visitors)

	var top_browsers []TopCount
	payload.TopBrowsers = make(map[string]int)
	db.Raw("SELECT browser as Name, COUNT(DISTINCT browser) as Count FROM sessions GROUP BY browser").Scan(&top_browsers)
	for _, browser := range top_browsers {
		payload.TopBrowsers[browser.Name] = browser.Count
	}

	var top_oss []TopCount
	payload.TopOss = make(map[string]int)
	db.Raw("SELECT os as Name, COUNT(DISTINCT os) as Count FROM sessions GROUP BY os").Scan(&top_oss)
	for _, os := range top_oss {
		payload.TopOss[os.Name] = os.Count
	}

	var top_cities []TopCount
	payload.TopCities = make(map[string]int)
	db.Raw("SELECT city as Name, COUNT(DISTINCT city) as Count FROM sessions GROUP BY city").Scan(&top_cities)
	for _, city := range top_cities {
		payload.TopCities[city.Name] = city.Count
	}

	var top_regions []TopCount
	payload.TopRegions = make(map[string]int)
	db.Raw("SELECT region as Name, COUNT(DISTINCT region) as Count FROM sessions GROUP BY region").Scan(&top_regions)
	for _, region := range top_regions {
		payload.TopRegions[region.Name] = region.Count
	}

	var top_countries []TopCount
	payload.TopCountries = make(map[string]int)
	db.Raw("SELECT country as Name, COUNT(DISTINCT country) as Count FROM sessions GROUP BY country").Scan(&top_countries)
	for _, country := range top_countries {
		payload.TopCountries[country.Name] = country.Count
	}

	var top_entry_pages []TopCount
	payload.TopEntryPages = make(map[string]int)
	db.Raw("SELECT page_url as Name, COUNT(DISTINCT page_url) as Count FROM entries GROUP BY page_url").Scan(&top_entry_pages)
	for _, page := range top_entry_pages {
		payload.TopEntryPages[page.Name] = page.Count
	}

	var top_exit_pages []TopCount
	payload.TopExitPages = make(map[string]int)
	db.Raw("SELECT page_url as Name, COUNT(DISTINCT page_url) as Count FROM exits GROUP BY page_url").Scan(&top_exit_pages)
	for _, page := range top_exit_pages {
		payload.TopExitPages[page.Name] = page.Count
	}

	var windowSizes WindowSizes
	db.Raw("SELECT COUNT(Size) as Desktop FROM sessions WHERE Size >= 1440").Scan(&windowSizes.Desktop)
	db.Raw("SELECT COUNT(Size) as Laptop FROM sessions WHERE Size >= 992 AND Size < 1440").Scan(&windowSizes.Laptop)
	db.Raw("SELECT COUNT(Size) as Tablet FROM sessions WHERE Size >= 576 AND Size < 992").Scan(&windowSizes.Tablet)
	db.Raw("SELECT COUNT(Size) as Mobile FROM sessions WHERE Size < 576").Scan(&windowSizes.Mobile)
	payload.Sizes = windowSizes

	var top_pages []TopCount
	payload.TopPages = make(map[string]int)
	db.Raw("SELECT page_url AS Name, COUNT(page_url) AS Count from session_pages group by page_url").Scan(&top_pages)
	for _, page := range top_pages {
		payload.TopPages[page.Name] = page.Count
	}

	var didnt_bounce int64
	db.Raw("SELECT COUNT(*) FROM (SELECT session_id from session_pages group by session_id HAVING COUNT(session_id) > 1) AS q").Count(&didnt_bounce)
	payload.BounceRate = 1.0 - float32(didnt_bounce)/float32(unique_visitors)

	// top_sources
	var top_sources []TopCount
	payload.TopSources = make(map[string]int)
	db.Raw("SELECT referrer as Name, COUNT(DISTINCT referrer) as Count FROM sessions GROUP BY referrer").Scan(&top_sources)
	for _, page := range top_sources {
		payload.TopSources[page.Name] = page.Count
	}

	p, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}
	return string(p)
}

func webpageAnalytics(w http.ResponseWriter, req *http.Request, ps httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	r := req.URL.Query()
	query_type := r.Get("type")

	switch query_type {
	case "month":
		// y, m, _ := time.Now().Date()
		if _, err := strconv.Atoi(r.Get("m")); err == nil {
			if _, err := strconv.Atoi(r.Get("y")); err == nil {
				// fmt.Fprintf(w, GetMonth(r.Get("m"), r.Get("y")))
			} else {
				// fmt.Fprintf(w, GetMonth(r.Get("m"), strconv.Itoa(y)))
			}
		} else {
			// fmt.Fprintf(w, GetMonth(strconv.Itoa(int(m)), strconv.Itoa(y)))
		}
	default:
		fmt.Fprintf(w, AllTime())
	}
}

func str(s interface{}) string {
	if s == nil {
		return "none"
	}
	return s.(string)
}

func analytics(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		panic(err)
	}
	var t map[string]interface{}
	json.Unmarshal(body, &t)

	ip, _, _ := net.SplitHostPort(req.RemoteAddr)

	userAgent := req.UserAgent()
	ua := user_agent.New(userAgent)

	resp, err := http.Get("https://ipinfo.io/" + ip)
	if err != nil {
		panic(err)
	}
	body, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
	var geo map[string]interface{}
	json.Unmarshal(body, &geo)

	name, version := ua.Browser()

	sid := generateSessionId(t["h"].(string), ip, userAgent)

	var session Session
	result := db.Take(&session, "id = ?", sid)

	if result.RowsAffected == 0 {
		db.Create(&Session{
			Id:             sid,
			Size:           int(t["w"].(float64)),
			Browser:        name,
			BrowserVersion: version,
			Os:             ua.OS(),
			City:           str(geo["city"]),
			Region:         str(geo["region"]),
			Country:        str(geo["country"]),
			Referrer:       str(t["r"]),
			EntryPage:      Entry{PageUrl: str(t["p"]), SessionId: sid},
			ExitPage:       Exit{PageUrl: str(t["p"]), SessionId: sid},
			UpdatedAt:      time.Now(),
			CreatedAt:      time.Now(),
		})
		db.Create(&SessionPages{
			SessionId: sid,
			PageUrl:   str(t["p"]),
			CreatedAt: time.Now(),
		})

	} else if result.RowsAffected > 0 {
		db.Create(&SessionPages{
			SessionId: sid,
			PageUrl:   str(t["p"]),
			CreatedAt: time.Now(),
		})
		session.ExitPage = Exit{PageUrl: str(t["p"]), SessionId: sid}
		db.Save(&session)
	}
}

func GetDatabase() (*sql.DB, error) {
	db, err := sql.Open("mysql", os.Getenv("DSN"))
	return db, err
}

func main() {
	err := godotenv.Load()

	db, err = gorm.Open(mysql.Open(os.Getenv("DSN")), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})

	if err != nil {
		panic(err)
	}
	/*
		db.AutoMigrate(&Session{})
		db.AutoMigrate(&Page{})
		db.AutoMigrate(&SessionPages{})
		db.AutoMigrate(&Entry{})
		db.AutoMigrate(&Exit{})
	*/
	// db.Migrator().DropTable(&Session{})

	myport := strconv.Itoa(8080)

	r := httprouter.New()

	r.GET("/", analyticsScript)
	r.POST("/", analytics)

	r.GET("/site/:webpage", webpageAnalytics)

	l, err := net.Listen("tcp", "0.0.0.0:"+myport)
	if err != nil {
		panic(err)
	}
	fmt.Println("Server started at port:" + myport)

	panic(http.Serve(l, r))
}
