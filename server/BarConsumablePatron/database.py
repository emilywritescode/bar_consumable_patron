from sqlalchemy import create_engine
from sqlalchemy import sql, exc

from BarConsumablePatron import config

engine = create_engine(config.database_uri)

# select all bars
def get_bars():
	with engine.connect() as con:
		rs = con.execute("SELECT Name, License, City, State, CAST(Hour(Opening) as CHAR) as Opening, CAST(Hour(Closing) as CHAR) as Closing FROM Bars;")
		
		return [dict(row) for row in rs]

# select from Bars given a Bar's license	
def find_bar(license):
	with engine.connect() as con:
		query = sql.text("SELECT Name, License, City, State, CAST(Hour(Opening) as CHAR) as Opening, CAST(Hour(Closing) as CHAR) as Closing FROM Bars WHERE License = :license;")
		
		rs = con.execute(query, license=license)
		result = rs.first()
		if result is None:
			return None
		return dict(result)

# select all patrons
def get_patrons():
    with engine.connect() as con:
        rs = con.execute("SELECT name, phone, city, state FROM Patrons;")
        return [dict(row) for row in rs]

# select from Patrons given patron's phone
def find_patron(phone):
    with engine.connect() as con:
        query = sql.text(
            "SELECT name, phone, city, state FROM Patrons WHERE phone = :phone;"
        )

        rs = con.execute(query, phone=phone)
        result = rs.first()
        if result is None:
            return None
        return dict(result)
		
# select all beers
def get_beers():
	with engine.connect() as con:
		rs = con.execute("SELECT name, manufacturer, type FROM Beers;")
		
		return [dict(row) for row in rs]
		
# select from Beers given beer's name
def find_beer(name):
	with engine.connect() as con:
		query = sql.text("SELECT name, manufacturer, type FROM Beers WHERE name = :name;")
		
		rs = con.execute(query, name=name)
		result = rs.first()
		if result is None:
			return None
		return dict(result)
		
		
# select all bars that have a given beer on its menu, along with the total amount they have sold
def list_bars_that_have_this_beer_on_menu(name):
	with engine.connect() as con:
		query = sql.text('select b1.Name as barName, s.price as price, sum(b2.quantity) as amount from Bars b1, Sells s, Bills b, Bought b2 where :name = s.consumable_name and b2.consumable_name = s.consumable_name and b1.License = s.bar_license and b1.License = b.bar_license and b.transid = b2.transid group by(barName) order by amount desc;')
		
		rs = con.execute(query, name=name)
		res = [dict(row) for row in rs]
		for r in res:
			r['price'] = float(r['price'])
			r['amount'] = int(r['amount'])
		return res
		
#get all patrons that have bought this beer, along with the total amount they bought
def list_patrons_that_buy_this_beer(name):
	with engine.connect() as con:
		query = sql.text('select p.name as name, p.phone as phone, sum(b2.quantity) as amount from Bought b2, Bills B, Patrons p where b2.consumable_name = :name and B.patron_phone = p.phone and b2.transid = B.transid group by(p.name) order by amount desc;')
		
		rs = con.execute(query, name=name)
		res = [dict(row) for row in rs]
		for r in res:
			r['amount'] = int(r['amount'])
		return res
		
#get all transactions that have this beer, along with the hour it was purchased
def list_transactions_with_this_beer(name):
	with engine.connect() as con:
		query = sql.text('select b.transid as transid, (HOUR(b.timestamp)) as time, t.quantity as amount from Bills b, Bought t where b.transid = t.transid and t.consumable_name = :name order by time asc;')
		rs = con.execute(query, name=name)
		return  [dict(row) for row in rs]


# select all Bar,Beer pairs where Beer's price is less than given max price
def find_beers_less_than(max_price):
	with engine.connect() as con:
		query = sql.text("SELECT * FROM Sells WHERE price < :max_price;")
		
		rs = con.execute(query, max_price = max_price)
		return [dict(row) for row in rs]


def db_query(input):
	print(input)
	with engine.connect() as con:
		try:
			query = sql.text(input)
			rs = con.execute(query)
		except exc.SQLAlchemyError as a:
			raise a
		except Exception as e:
			raise e
			