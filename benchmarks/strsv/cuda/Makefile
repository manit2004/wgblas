CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/strsv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/strsv: strsv.c $(HDRS) | $(BIN)
	$(CC) strsv.c -o $(BIN)/strsv -lcublas

clean:
	rm -rf $(BIN)
