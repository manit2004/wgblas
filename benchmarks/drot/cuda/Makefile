CC = nvcc
BIN = bin

all: $(BIN)/cosine.drot $(BIN)/sine.drot $(BIN)/drot $(BIN)/stride.drot

$(BIN):
	mkdir -p $(BIN)

$(BIN)/cosine.drot: cosine.drot.c ../../utils/helpers.h | $(BIN)
	$(CC) cosine.drot.c -o $(BIN)/cosine.drot -lcublas

$(BIN)/sine.drot: sine.drot.c ../../utils/helpers.h | $(BIN)
	$(CC) sine.drot.c -o $(BIN)/sine.drot -lcublas

$(BIN)/drot: drot.c ../../utils/helpers.h | $(BIN)
	$(CC) drot.c -o $(BIN)/drot -lcublas

$(BIN)/stride.drot: stride.drot.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.drot.c -o $(BIN)/stride.drot -lcublas

clean:
	rm -rf $(BIN)
